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
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  FadeInDown,
  SlideInUp,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { Send, Sparkles, Lock } from "lucide-react-native"
import { useRouter } from "expo-router"
import { useCreatePost } from "../../hooks/useCreatePost"

const { width, height } = Dimensions.get("window")

const categories = [
  { id: "life", name: "Life", emoji: "🌟" },
  { id: "love", name: "Love", emoji: "💕" },
  { id: "anxiety", name: "Anxiety", emoji: "😰" },
  { id: "social", name: "Social", emoji: "👥" },
  { id: "loneliness", name: "Lonely", emoji: "😔" },
  { id: "validation", name: "Support", emoji: "🤗" },
]

export default function CreateScreen() {
  const [postText, setPostText] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState("life")
  const maxChars = 280
  const router = useRouter()

  // 🔥 Use the custom hook
  const { createPost, loading, error } = useCreatePost()

  const headerOpacity = useSharedValue(0)
  const formOpacity = useSharedValue(0)
  const buttonScale = useSharedValue(1)
  const sparkleRotation = useSharedValue(0)
  const pulseAnimation = useSharedValue(1)

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 })
    formOpacity.value = withTiming(1, { duration: 1000, easing: Easing.out(Easing.quad) })
    sparkleRotation.value = withTiming(360, { duration: 4000, easing: Easing.linear })
    pulseAnimation.value = withSequence(withTiming(1.05, { duration: 1000 }), withTiming(1, { duration: 1000 }))
  }, [])

  const handleTextChange = (text) => {
    if (text.length <= maxChars) {
      setPostText(text)
      setCharCount(text.length)
    }
  }

  // 🔥 Handle post creation
  const handlePost = async () => {
    if (!postText.trim()) {
      Alert.alert("Error", "Please write something before posting!")
      return
    }

    try {
      buttonScale.value = withSequence(withTiming(0.95, { duration: 100 }), withTiming(1, { duration: 100 }))

      // Use the hook to create post
      await createPost(postText.trim(), selectedCategory)

      // Clear the form
      setPostText("")
      setCharCount(0)

      // Show success message
      Alert.alert("Success! 🔥", "Your secret has been dropped anonymously!", [
        {
          text: "View Feed",
          onPress: () => router.push("/(tabs)/feed"),
        },
        {
          text: "Drop Another",
          style: "cancel",
        },
      ])
    } catch (err) {
      Alert.alert("Error", `Failed to post your secret: ${err.message}`)
    }
  }

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: interpolate(headerOpacity.value, [0, 1], [-30, 0]) }],
  }))

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: interpolate(formOpacity.value, [0, 1], [50, 0]) }],
  }))

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value * pulseAnimation.value }],
  }))

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }))

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <LinearGradient colors={["#000000", "rgba(0,0,0,0.8)"]} style={styles.headerGradient}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>DROP IT</Text>
              <Animated.View style={sparkleAnimatedStyle}>
                <Sparkles size={24} color="#ff69b4" />
              </Animated.View>
            </View>
            <Text style={styles.headerSubtitle}>Spill the tea ☕</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={[styles.form, formAnimatedStyle]}>
          {/* Category Selection */}
          <Animated.View style={styles.categorySection} entering={FadeInDown.delay(100)}>
            <Text style={styles.sectionTitle}>Choose a vibe:</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryButton, selectedCategory === category.id && styles.categoryButtonActive]}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                  <Text style={[styles.categoryText, selectedCategory === category.id && styles.categoryTextActive]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>

          <Animated.View style={styles.inputSection} entering={FadeInDown.delay(200)}>
            <View style={styles.inputContainer}>
              <LinearGradient
                colors={["#ff69b4", "#a020f0"]}
                style={styles.inputBorder}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.inputInner}>
                  <TextInput
                    style={styles.textInput}
                    placeholder="What's your secret? Spill it all here... 👀"
                    placeholderTextColor="#666666"
                    multiline
                    value={postText}
                    onChangeText={handleTextChange}
                    maxLength={maxChars}
                    editable={!loading}
                  />
                </View>
              </LinearGradient>

              <View style={styles.inputFooter}>
                <Text style={[styles.charCounter, charCount > maxChars * 0.9 && styles.charCounterWarning]}>
                  {charCount}/{maxChars}
                </Text>
                <Text style={styles.inputHint}>🔒 Completely anonymous</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            style={[styles.postButtonContainer, buttonAnimatedStyle]}
            entering={SlideInUp.delay(400).springify()}
          >
            <TouchableOpacity
              style={[styles.postButton, (!postText.trim() || loading) && styles.postButtonDisabled]}
              onPress={handlePost}
              disabled={!postText.trim() || loading}
            >
              <LinearGradient
                colors={postText.trim() && !loading ? ["#ff69b4", "#a020f0"] : ["#333333", "#555555"]}
                style={styles.postButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Send size={20} color="#ffffff" />
                <Text style={styles.postButtonText}>{loading ? "🔄 DROPPING..." : "🔥 DROP THE SECRET 🔥"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          {error && (
            <Animated.View style={styles.errorNotice} entering={FadeInDown.delay(600)}>
              <Text style={styles.errorText}>❌ {error}</Text>
            </Animated.View>
          )}

          <Animated.View style={styles.privacyNotice} entering={FadeInDown.delay(600)}>
            <Lock size={16} color="#ff69b4" />
            <Text style={styles.privacyText}>
              Your secrets are safe. No tracking, no data collection, just pure anonymity.
            </Text>
          </Animated.View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    zIndex: 10,
  },
  headerGradient: {
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#ff69b4",
    fontStyle: "italic",
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 15,
  },
  categorySection: {
    marginBottom: 30,
  },
  categoryScroll: {
    flexDirection: "row",
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#111111",
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#333333",
  },
  categoryButtonActive: {
    backgroundColor: "#ff69b4",
    borderColor: "#ff69b4",
  },
  categoryEmoji: {
    fontSize: 16,
  },
  categoryText: {
    color: "#666666",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryTextActive: {
    color: "#ffffff",
  },
  inputSection: {
    marginBottom: 30,
  },
  inputContainer: {
    position: "relative",
  },
  inputBorder: {
    borderRadius: 20,
    padding: 2,
  },
  inputInner: {
    backgroundColor: "#111111",
    borderRadius: 18,
    padding: 20,
  },
  textInput: {
    color: "#ffffff",
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: "top",
  },
  inputFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 5,
  },
  charCounter: {
    color: "#666666",
    fontSize: 12,
  },
  charCounterWarning: {
    color: "#ff69b4",
  },
  inputHint: {
    color: "#666666",
    fontSize: 12,
    fontStyle: "italic",
  },
  postButtonContainer: {
    marginBottom: 30,
  },
  postButton: {
    shadowColor: "#ff69b4",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  postButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  errorNotice: {
    padding: 15,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.3)",
    marginBottom: 20,
  },
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    textAlign: "center",
  },
  privacyNotice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(255, 105, 180, 0.1)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 105, 180, 0.3)",
  },
  privacyText: {
    color: "#ffffff",
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
    opacity: 0.8,
  },
})
