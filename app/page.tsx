'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface Recipe {
  name: string
  ingredients: string[]
  instructions: string[]
  cookingTime: string
  servings: string
}

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setRecipes([])
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedImage) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', selectedImage)

      const response = await fetch('/api/generate-recipes', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to generate recipes')
      }

      const data = await response.json()
      setRecipes(data.recipes)
    } catch (err) {
      setError('Failed to generate recipes. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>🍳 AI Recipe Generator</h1>
        <p className={styles.subtitle}>
          Upload a photo of your leftover ingredients and get instant recipe ideas!
        </p>

        <div className={styles.card}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.uploadSection}>
              <label htmlFor="image-upload" className={styles.uploadLabel}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className={styles.preview} />
                ) : (
                  <div className={styles.uploadPlaceholder}>
                    <span className={styles.uploadIcon}>📸</span>
                    <span>Click to upload image</span>
                  </div>
                )}
              </label>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
            </div>

            <button
              type="submit"
              disabled={!selectedImage || loading}
              className={styles.button}
            >
              {loading ? 'Generating Recipes...' : 'Generate Recipes'}
            </button>
          </form>

          {error && <div className={styles.error}>{error}</div>}
        </div>

        {recipes.length > 0 && (
          <div className={styles.recipesContainer}>
            <h2 className={styles.recipesTitle}>Your Recipe Ideas</h2>
            {recipes.map((recipe, index) => (
              <div key={index} className={styles.recipeCard}>
                <h3 className={styles.recipeName}>{recipe.name}</h3>
                <div className={styles.recipeMetadata}>
                  <span>⏱️ {recipe.cookingTime}</span>
                  <span>👥 {recipe.servings}</span>
                </div>

                <div className={styles.recipeSection}>
                  <h4>Ingredients:</h4>
                  <ul>
                    {recipe.ingredients.map((ingredient, i) => (
                      <li key={i}>{ingredient}</li>
                    ))}
                  </ul>
                </div>

                <div className={styles.recipeSection}>
                  <h4>Instructions:</h4>
                  <ol>
                    {recipe.instructions.map((instruction, i) => (
                      <li key={i}>{instruction}</li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.whatsappSection}>
          <h2>📱 Use via WhatsApp</h2>
          <p>Send your ingredient photos directly to WhatsApp and get recipes instantly!</p>
          <div className={styles.instructions}>
            <ol>
              <li>Save this number: <strong>+1 415 523 8886</strong></li>
              <li>Send a WhatsApp message: <strong>"join &lt;your-code&gt;"</strong></li>
              <li>Send a photo of your ingredients</li>
              <li>Receive 3 recipe suggestions!</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  )
}
