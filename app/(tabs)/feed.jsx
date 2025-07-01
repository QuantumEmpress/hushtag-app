"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  RefreshControl,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { apiService } from "../../services/api"

const { width, height } = Dimensions.get("window")

const categoryColors = {
  love: "#ff69b4",
  life: "#9d4edd",
  social: "#f72585",
  loneliness: "#4361ee",
  existential: "#7209b7",
  anxiety: "#f77f00",
  comfort: "#fcbf49",
  validation: "#06ffa5",
}

const emojiReactions = ["😂", "😢", "😳", "❤️", "🔥"]

export default function FeedScreen() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sortBy, setSortBy] = useState("recent")
  const [bookmarkedPosts, setBookmarkedPosts] = useState(new Set())

  // 🔥 Track user interactions locally (like TikTok)
  const [userLikes, setUserLikes] = useState(new Set()) // Posts user has liked
  const [userReactions, setUserReactions] = useState({}) // Post ID -> emoji

  // 🔥 Load posts from backend using apiService
  const loadPosts = async (sort = "recent") => {
    try {
      setLoading(true)
      const response = await apiService.getPosts(0, sort)
      setPosts(response.content || [])
    } catch (error) {
      console.error("Failed to load posts:", error)
      Alert.alert("Error", "Failed to load posts. Make sure your backend is running.")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 Refresh posts
  const refreshPosts = async () => {
    setRefreshing(true)
    await loadPosts(sortBy)
    setRefreshing(false)
  }

  // 🔥 Like/Unlike toggle (like TikTok)
  const handleSupport = async (postId) => {
    try {
      const isLiked = userLikes.has(postId)

      if (isLiked) {
        // Unlike: Remove from user likes and decrease count
        setUserLikes((prev) => {
          const newSet = new Set(prev)
          newSet.delete(postId)
          return newSet
        })

        setPosts((prev) =>
          prev.map((post) => (post.id === postId ? { ...post, likes: Math.max(0, post.likes - 1) } : post)),
        )
      } else {
        // Like: Add to user likes and increase count
        setUserLikes((prev) => new Set([...prev, postId]))

        setPosts((prev) => prev.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))

        // Call backend to update database
        await apiService.likePost(postId)
      }
    } catch (error) {
      console.error("Failed to like post:", error)
      // Revert on error
      setUserLikes((prev) => {
        const newSet = new Set(prev)
        if (newSet.has(postId)) {
          newSet.delete(postId)
        } else {
          newSet.add(postId)
        }
        return newSet
      })
    }
  }

  // 🔥 Reaction toggle (like TikTok)
  const handleReaction = async (postId, emoji) => {
    try {
      const currentReaction = userReactions[postId]

      if (currentReaction === emoji) {
        // Remove reaction: User clicked same emoji
        setUserReactions((prev) => {
          const newReactions = { ...prev }
          delete newReactions[postId]
          return newReactions
        })

        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              const newReactions = { ...post.reactions }
              newReactions[emoji] = Math.max(0, (newReactions[emoji] || 0) - 1)
              return { ...post, reactions: newReactions }
            }
            return post
          }),
        )
      } else {
        // Change/Add reaction
        setUserReactions((prev) => ({
          ...prev,
          [postId]: emoji,
        }))

        setPosts((prev) =>
          prev.map((post) => {
            if (post.id === postId) {
              const newReactions = { ...post.reactions }

              // Remove old reaction count
              if (currentReaction) {
                newReactions[currentReaction] = Math.max(0, (newReactions[currentReaction] || 0) - 1)
              }

              // Add new reaction count
              newReactions[emoji] = (newReactions[emoji] || 0) + 1

              return { ...post, reactions: newReactions }
            }
            return post
          }),
        )

        // Call backend to update database
        await apiService.addReaction(postId, emoji)
      }
    } catch (error) {
      console.error("Failed to add reaction:", error)
    }
  }

  const handleBookmark = (postId) => {
    setBookmarkedPosts((prev) => {
      const newSet = new Set(prev)
      newSet.has(postId) ? newSet.delete(postId) : newSet.add(postId)
      return newSet
    })
  }

  // 🔥 Format timestamp
  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  // 🔥 Change sort order
  const handleSortChange = (newSort) => {
    setSortBy(newSort)
    loadPosts(newSort)
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const renderPost = ({ item }) => {
    const isLiked = userLikes.has(item.id) // Check if user liked this post
    const isBookmarked = bookmarkedPosts.has(item.id)
    const categoryColor = categoryColors[item.category] || "#ff69b4"
    const userReaction = userReactions[item.id] // Get user's reaction for this post

    return (
      <View style={[styles.confessionCard, { borderColor: categoryColor }]}>
        <LinearGradient colors={["#1a1a1a", "#000000"]} style={styles.cardGradient}>
          <View style={[styles.categoryIndicator, { backgroundColor: categoryColor }]} />

          <Text style={styles.confessionText}>{item.content}</Text>

          <View style={styles.reactionsRow}>
            {emojiReactions.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => handleReaction(item.id, emoji)}
                style={[
                  styles.emojiBtn,
                  userReaction === emoji && styles.emojiSelected, // Highlight if user reacted
                ]}
              >
                <Text style={styles.emojiText}>{emoji}</Text>
                {item.reactions && item.reactions[emoji] > 0 && (
                  <Text style={styles.reactionCount}>{item.reactions[emoji]}</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.timeContainer}>
              <Ionicons name="time-outline" size={12} color="#666" />
              <Text style={styles.timeText}>{formatTimeAgo(item.timestamp)}</Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <TouchableOpacity onPress={() => handleBookmark(item.id)}>
                <Ionicons
                  name={isBookmarked ? "bookmark" : "bookmark-outline"}
                  size={20}
                  color={isBookmarked ? "#ff69b4" : "#888"}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleSupport(item.id)}>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"} // Show filled heart if liked
                    size={20}
                    color={isLiked ? "#ff69b4" : "#888"} // Pink if liked, gray if not
                  />
                  <Text style={styles.likeCount}>{item.likes || 0}</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <BlurView intensity={80} style={styles.header}>
        <LinearGradient colors={["#000000", "#1a1a1a"]} style={styles.headerGradient}>
          <Text style={styles.headerTitle}>🔥 Anonymous Feed 🔥</Text>

          {/* Sort Buttons */}
          <View style={styles.sortContainer}>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === "recent" && styles.sortButtonActive]}
              onPress={() => handleSortChange("recent")}
            >
              <Text style={[styles.sortButtonText, sortBy === "recent" && styles.sortButtonTextActive]}>Recent</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, sortBy === "popular" && styles.sortButtonActive]}
              onPress={() => handleSortChange("popular")}
            >
              <Text style={[styles.sortButtonText, sortBy === "popular" && styles.sortButtonTextActive]}>Popular</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </BlurView>

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refreshPosts} tintColor="#ff69b4" colors={["#ff69b4"]} />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {loading ? "Loading secrets... 👀" : "No secrets yet. Be the first to drop one! 🔥"}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: { paddingTop: Platform.OS === "ios" ? 0 : 20 },
  headerGradient: { padding: 20, alignItems: "center" },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textShadowColor: "#ff69b4",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    marginBottom: 15,
  },
  sortContainer: {
    flexDirection: "row",
    gap: 10,
  },
  sortButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#333",
  },
  sortButtonActive: {
    backgroundColor: "#ff69b4",
  },
  sortButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  sortButtonTextActive: {
    color: "#fff",
  },
  feedContainer: { padding: 20, paddingBottom: 120 },
  confessionCard: {
    borderRadius: 18,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#ff69b4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  cardGradient: { padding: 20, position: "relative" },
  categoryIndicator: { position: "absolute", top: 0, left: 0, right: 0, height: 3 },
  confessionText: { color: "#fff", fontSize: 16, fontWeight: "500", marginBottom: 16 },
  reactionsRow: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
    justifyContent: "flex-start",
  },
  emojiBtn: {
    backgroundColor: "#111",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  emojiSelected: {
    backgroundColor: "#ff69b4",
    borderColor: "#ff69b4",
  },
  emojiText: { color: "#fff", fontSize: 14 },
  reactionCount: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  timeContainer: { flexDirection: "row", alignItems: "center" },
  timeText: { fontSize: 12, color: "#666", marginLeft: 4, fontStyle: "italic" },
  likeCount: { color: "#fff", fontSize: 12 },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
})
