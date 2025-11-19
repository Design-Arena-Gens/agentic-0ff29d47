import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import twilio from 'twilio'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

async function generateRecipesFromImage(imageUrl: string): Promise<string> {
  try {
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
- Recipe name
- Key ingredients
- Brief cooking instructions (3-4 steps max)
- Cooking time

Format the response in a clean, readable WhatsApp message format. Keep it concise but informative.`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 1500,
    })

    return response.choices[0].message.content || 'Could not generate recipes'
  } catch (error) {
    console.error('Error generating recipes:', error)
    return 'Sorry, I encountered an error generating recipes. Please try again.'
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const from = formData.get('From') as string
    const numMedia = parseInt(formData.get('NumMedia') as string || '0')
    const body = formData.get('Body') as string

    console.log('Received WhatsApp message from:', from)
    console.log('Number of media:', numMedia)
    console.log('Message body:', body)

    let responseMessage = ''

    if (numMedia > 0) {
      // User sent an image
      const mediaUrl = formData.get('MediaUrl0') as string
      console.log('Processing image:', mediaUrl)

      responseMessage = '🍳 *AI Recipe Generator*\n\nAnalyzing your ingredients...\n\n'

      const recipes = await generateRecipesFromImage(mediaUrl)
      responseMessage += recipes
    } else {
      // User sent a text message
      responseMessage = `👋 Welcome to AI Recipe Generator!

📸 Send me a photo of your leftover ingredients (vegetables, meat, or any food items), and I'll generate 3 creative recipes for you!

Just snap a picture and send it here. No text needed!`
    }

    // Send response via Twilio
    await twilioClient.messages.create({
      body: responseMessage,
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: from,
    })

    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('Error processing WhatsApp message:', error)
    return new NextResponse('Error', { status: 500 })
  }
}

// Handle GET requests (for webhook verification)
export async function GET(request: NextRequest) {
  return NextResponse.json({ status: 'WhatsApp webhook is active' })
}
