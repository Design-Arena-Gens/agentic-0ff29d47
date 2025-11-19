import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')
    const mimeType = image.type || 'image/jpeg'

    // Call OpenAI Vision API
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image of food ingredients (vegetables, meat, or other items from a home kitchen). Generate exactly 3 creative, practical recipes using these ingredients.

For each recipe, provide:
1. Recipe name
2. List of ingredients (including the ones in the image plus common pantry items)
3. Step-by-step cooking instructions
4. Estimated cooking time
5. Number of servings

Format your response as a JSON array with this structure:
[
  {
    "name": "Recipe Name",
    "ingredients": ["ingredient 1", "ingredient 2", ...],
    "instructions": ["step 1", "step 2", ...],
    "cookingTime": "XX minutes",
    "servings": "X servings"
  }
]

Make the recipes diverse (e.g., different cuisines or cooking methods). Be practical and realistic with common home cooking techniques.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
    })

    const content = response.choices[0].message.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON from the response
    let recipes
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
      const jsonString = jsonMatch ? jsonMatch[1] : content
      recipes = JSON.parse(jsonString)
    } catch (parseError) {
      console.error('Failed to parse recipes:', content)
      throw new Error('Failed to parse recipe data')
    }

    // Ensure we have at least 3 recipes
    if (!Array.isArray(recipes) || recipes.length < 3) {
      throw new Error('Did not receive 3 recipes')
    }

    return NextResponse.json({ recipes: recipes.slice(0, 3) })
  } catch (error) {
    console.error('Error generating recipes:', error)
    return NextResponse.json(
      { error: 'Failed to generate recipes' },
      { status: 500 }
    )
  }
}
