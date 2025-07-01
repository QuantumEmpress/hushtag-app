"use client"

import { useState, useEffect } from "react"
import { apiService } from "../services/api"

export function usePosts(sort = "recent") {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const loadPosts = async (pageNum = 0, isRefresh = false) => {
    try {
      setLoading(true)
      setError(null)

      const response = await apiService.getPosts(pageNum, sort)
      const newPosts = response.content || []

      if (isRefresh || pageNum === 0) {
        setPosts(newPosts)
      } else {
        setPosts((prev) => [...prev, ...newPosts])
      }

      setHasMore(newPosts.length === 10) // If we got 10 posts, there might be more
      setPage(pageNum)
    } catch (err) {
      setError("Failed to load posts. Make sure your backend is running.")
      console.error("Error loading posts:", err)
    } finally {
      setLoading(false)
    }
  }

  const refreshPosts = () => {
    loadPosts(0, true)
  }

  const loadMorePosts = () => {
    if (!loading && hasMore) {
      loadPosts(page + 1, false)
    }
  }

  const likePost = async (postId) => {
    try {
      const updatedPost = await apiService.likePost(postId)
      setPosts((prev) => prev.map((post) => (post.id === postId ? updatedPost : post)))
    } catch (err) {
      console.error("Error liking post:", err)
      throw err
    }
  }

  const addReaction = async (postId, emoji) => {
    try {
      const updatedPost = await apiService.addReaction(postId, emoji)
      setPosts((prev) => prev.map((post) => (post.id === postId ? updatedPost : post)))
    } catch (err) {
      console.error("Error adding reaction:", err)
      throw err
    }
  }

  useEffect(() => {
    loadPosts()
  }, [sort])

  return {
    posts,
    loading,
    error,
    refreshPosts,
    loadMorePosts,
    hasMore,
    likePost,
    addReaction,
  }
}
