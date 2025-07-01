

const API_BASE_URL = "http://172.20.10.4:8080/api"

class ApiService {
  async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error: ${response.status} - ${errorText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  // 🔥 Get posts from Spring Boot backend
  async getPosts(page = 0, sort = "recent", category = null) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: "10",
      sort: sort,
    })

    if (category) {
      params.append("category", category)
    }

    return this.request(`/posts?${params}`)
  }

  // 🔥 Create new post
  async createPost(content, category) {
    return this.request("/posts", {
      method: "POST",
      body: JSON.stringify({
        content: content,
        category: category,
      }),
    })
  }

  // 🔥 Like a post (simple version)
  async likePost(postId) {
    return this.request(`/posts/${postId}/like`, {
      method: "POST",
    })
  }

  // 🔥 Add reaction to post (simple version)
  async addReaction(postId, emoji) {
    return this.request(`/posts/${postId}/react`, {
      method: "POST",
      body: JSON.stringify({
        emoji: emoji,
      }),
    })
  }

  // 🔥 Search posts
  async searchPosts(query) {
    return this.request(`/posts/search?q=${encodeURIComponent(query)}`)
  }

  // 🔥 Health check
  async healthCheck() {
    return this.request("/posts/health")
  }
}

// Export singleton instance
export const apiService = new ApiService()
