"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ScrollView,
  FlatList,
  Alert,
} from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolate } from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { Search, TrendingUp, Hash } from "lucide-react-native"

const { width } = Dimensions.get("window")

// 🔥 API Configuration
const API_BASE_URL = "http://172.20.10.4:8080/api"

const trendingHashtags = [
  { tag: "#OfficeSecrets", posts: 1234 },
  { tag: "#RelationshipTea", posts: 2567 },
  { tag: "#FamilyDrama", posts: 890 },
  { tag: "#CollegeLife", posts: 1456 },
  { tag: "#WorkStress", posts: 987 },
]

export default function ExploreScreen() {
  const [searchText, setSearchText] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const headerOpacity = useSharedValue(0)

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 })
  }, [])

  // 🔥 Search posts in backend
  const handleSearch = async (query) => {
    if (query.trim().length < 2) {
      setSearchResults([])
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/posts/search?q=${encodeURIComponent(query)}`)

      if (response.ok) {
        const results = await response.json()
        setSearchResults(results)
      } else {
        throw new Error("Search failed")
      }
    } catch (error) {
      console.error("Search failed:", error)
      Alert.alert("Error", "Search failed. Make sure your backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const handleTextChange = (text) => {
    setSearchText(text)
    // Debounce search
    setTimeout(() => {
      if (text === searchText) {
        handleSearch(text)
      }
    }, 500)
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const postTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const renderSearchResult = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTime}>{formatTimeAgo(item.timestamp)}</Text>
      <Text style={styles.postContent}>{item.content}</Text>
      <View style={styles.postStats}>
        <Text style={styles.stat}>❤️ {item.likes || 0}</Text>
        <Text style={styles.stat}>💬 {item.comments || 0}</Text>
        <Text style={styles.categoryTag}>#{item.category}</Text>
      </View>
    </View>
  )

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-30, 0]) }],
  }))

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <LinearGradient colors={["#000000", "rgba(0,0,0,0.8)"]} style={styles.headerGradient}>
          <Text style={styles.headerTitle}>EXPLORE 🔍</Text>
          <Text style={styles.headerSubtitle}>Search the anonymous void</Text>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Search Section */}
        <View style={styles.searchSection}>
          <LinearGradient colors={["#ff69b4", "#a020f0"]} style={styles.searchBorder}>
            <View style={styles.searchInner}>
              <Search size={20} color="#666666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search secrets, categories..."
                placeholderTextColor="#666666"
                value={searchText}
                onChangeText={handleTextChange}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Search Results */}
        {searchText.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {loading ? "🔍 Searching..." : `📝 Search Results (${searchResults.length})`}
            </Text>
            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
              />
            ) : !loading && searchText.length > 1 ? (
              <View style={styles.emptyResults}>
                <Text style={styles.emptyText}>No secrets found for "{searchText}"</Text>
                <Text style={styles.emptySubtext}>Try different keywords or browse trending topics below</Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Trending Hashtags */}
        {searchText.length === 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <TrendingUp size={20} color="#ff69b4" />
              <Text style={styles.sectionTitle}>Trending Topics</Text>
            </View>
            {trendingHashtags.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.hashtagItem}
                onPress={() => {
                  setSearchText(item.tag)
                  handleSearch(item.tag)
                }}
              >
                <Hash size={16} color="#ff69b4" />
                <Text style={styles.hashtag}>{item.tag}</Text>
                <Text style={styles.hashtagCount}>{item.posts} posts</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Categories */}
        {searchText.length === 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🏷️ Browse by Category</Text>
            <View style={styles.categoriesGrid}>
              {["life", "love", "anxiety", "social", "loneliness", "validation"].map((category) => (
                <TouchableOpacity
                  key={category}
                  style={styles.categoryChip}
                  onPress={() => {
                    setSearchText(`#${category}`)
                    handleSearch(category)
                  }}
                >
                  <Text style={styles.categoryChipText}>#{category}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerGradient: {
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
    fontStyle: "italic",
  },
  content: {
    flex: 1,
  },
  searchSection: {
    padding: 20,
  },
  searchBorder: {
    borderRadius: 25,
    padding: 2,
  },
  searchInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 23,
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  hashtagItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: "#111",
    borderRadius: 12,
    marginBottom: 8,
  },
  hashtag: {
    color: "#ff69b4",
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  hashtagCount: {
    color: "#666",
    fontSize: 12,
  },
  categoriesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  categoryChip: {
    backgroundColor: "#111",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  categoryChipText: {
    color: "#ff69b4",
    fontSize: 14,
    fontWeight: "600",
  },
  postCard: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  postTime: {
    color: "#888",
    fontSize: 12,
    marginBottom: 5,
  },
  postContent: {
    color: "#fff",
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 10,
  },
  postStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  stat: {
    color: "#aaa",
    fontSize: 13,
  },
  categoryTag: {
    color: "#ff69b4",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyResults: {
    padding: 30,
    alignItems: "center",
  },
  emptyText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 5,
  },
  emptySubtext: {
    color: "#666",
    fontSize: 14,
    textAlign: "center",
  },
})
