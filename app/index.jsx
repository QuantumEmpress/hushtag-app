import React, { useEffect } from 'react';
import { Link } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const titleOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);
  const anonymousOpacity = useSharedValue(0);
  const creditOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(1);
  const backgroundAnimation = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  useEffect(() => {
    backgroundAnimation.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true
    );

    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );

    const startAnimations = () => {
      titleOpacity.value = withTiming(1, { duration: 1000 });
      setTimeout(() => taglineOpacity.value = withTiming(1, { duration: 800 }), 500);
      setTimeout(() => buttonOpacity.value = withTiming(1, { duration: 800 }), 1000);
      setTimeout(() => anonymousOpacity.value = withTiming(1, { duration: 600 }), 1500);
      setTimeout(() => creditOpacity.value = withTiming(1, { duration: 600 }), 2000);
    };

    setTimeout(startAnimations, 500);
  }, []);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: interpolate(titleOpacity.value, [0, 1], [30, 0]) }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: interpolate(taglineOpacity.value, [0, 1], [20, 0]) }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [
      { translateY: interpolate(buttonOpacity.value, [0, 1], [20, 0]) },
      { scale: buttonScale.value * pulseAnimation.value },
    ],
  }));

  const anonymousStyle = useAnimatedStyle(() => ({
    opacity: anonymousOpacity.value,
    transform: [{ translateY: interpolate(anonymousOpacity.value, [0, 1], [15, 0]) }],
  }));

  const creditStyle = useAnimatedStyle(() => ({
    opacity: creditOpacity.value,
  }));

  const backgroundStyle = useAnimatedStyle(() => {
    const translateX = interpolate(backgroundAnimation.value, [0, 1], [-50, 50]);
    const rotate = interpolate(backgroundAnimation.value, [0, 1], [0, 10]);
    return {
      transform: [{ translateX }, { rotate: `${rotate}deg` }],
    };
  });

  const resetVisited = async () => {
    await AsyncStorage.removeItem('visited');
    Alert.alert('Reset Done', 'You will see the welcome screen again next time!');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Animated.View style={[styles.backgroundGradient, backgroundStyle]}>
        <LinearGradient
          colors={['#000000', '#ff69b4', '#a020f0', '#000000']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </Animated.View>

      <View style={styles.particlesContainer}>
        <Animated.View style={[styles.particle, styles.particle1, backgroundStyle]} />
        <Animated.View style={[styles.particle, styles.particle2, backgroundStyle]} />
        <Animated.View style={[styles.particle, styles.particle3, backgroundStyle]} />
      </View>

      <View style={styles.content}>
        <Animated.Text style={[styles.appName, titleStyle]}>
          HUSHTAG 👀
        </Animated.Text>

        <Animated.Text style={[styles.tagline, taglineStyle]}>
          Say it. No one's watching. 👑
        </Animated.Text>

        <Animated.View style={buttonStyle}>
          <Link href="/(tabs)/feed" asChild>
            <TouchableOpacity style={styles.startButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#ff69b4', '#ff1493']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.buttonText}>🔥 START DROPPING 🔥</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
        </Animated.View>

        <Animated.Text style={[styles.anonymousText, anonymousStyle]}>
          🔒 100% anonymous. No login. No data. Just you.
        </Animated.Text>
      </View>

      <Animated.Text style={[styles.credit, creditStyle]}>
        built by Omalili ♛
      </Animated.Text>

      {/* ⚠️ Temporary RESET Button */}
      <TouchableOpacity
        onPress={resetVisited}
        style={{ position: 'absolute', bottom: 10, alignSelf: 'center' }}
      >
        <Text style={{ color: '#888', fontSize: 12 }}>Reset Onboarding</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  backgroundGradient: {
    position: 'absolute', width: width * 1.5, height: height * 1.5,
    top: -height * 0.25, left: -width * 0.25,
  },
  gradient: { flex: 1, opacity: 0.3 },
  particlesContainer: { position: 'absolute', width: '100%', height: '100%' },
  particle: { position: 'absolute', borderRadius: 50, opacity: 0.1 },
  particle1: { width: 100, height: 100, backgroundColor: '#ff69b4', top: '20%', left: '10%' },
  particle2: { width: 150, height: 150, backgroundColor: '#a020f0', top: '60%', right: '15%' },
  particle3: { width: 80, height: 80, backgroundColor: '#ff69b4', bottom: '25%', left: '20%' },
  content: { alignItems: 'center', paddingHorizontal: 30, zIndex: 10 },
  appName: {
    fontSize: 48, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 20,
    textShadowColor: '#ff69b4', textShadowOffset: { width: 0, height: 0 }, textShadowRadius: 20,
    letterSpacing: 2,
  },
  tagline: { fontSize: 20, color: '#fff', textAlign: 'center', marginBottom: 60, fontStyle: 'italic', opacity: 0.9, letterSpacing: 1 },
  startButton: { marginBottom: 40, shadowColor: '#ff69b4', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 10 },
  buttonGradient: { paddingVertical: 18, paddingHorizontal: 40, borderRadius: 30, minWidth: 280 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: '800', textAlign: 'center', letterSpacing: 1.5 },
  anonymousText: { fontSize: 14, color: '#fff', textAlign: 'center', opacity: 0.7, marginTop: 20, letterSpacing: 0.5 },
  credit: { position: 'absolute', bottom: 30, fontSize: 12, color: '#ff69b4', fontStyle: 'italic', opacity: 0.8, letterSpacing: 1 },
});
