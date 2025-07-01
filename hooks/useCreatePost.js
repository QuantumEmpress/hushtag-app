"use client"

import { useState } from "react"
import { apiService } from "../services/api"

export function useCreatePost() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const createPost = async (content, category) => {
    try {
      setLoading(true)
      setError(null)

      const newPost = await apiService.createPost(content, category)
      console.log("🔥 Post created successfully:", newPost)
      return newPost
    } catch (err) {
      const errorMessage = err.message || "Failed to create post"
      setError(errorMessage)
      console.error("Error creating post:", err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    createPost,
    loading,
    error,
  }
}
