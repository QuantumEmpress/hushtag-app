import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
  withSpring,
  Easing,
  interpolate,
  FadeInDown,
  SlideInRight,
  BounceIn,
  ZoomIn,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, Heart, MessageCircle, TrendingUp, Settings, BellOff, Sparkles, Sun, Zap, Star } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Enhanced notifications with more personality
const notifications = [
  {
    id: 1,
    type: 'celebration',
    title: '🎉 Welcome to HUSHTAG!',
    message: 'Your anonymous kingdom awaits! Ready to drop some secrets? ✨',
    timeAgo: 'Just now',
    isNew: true,
    icon: Sparkles,
    gradient: ['#ff69b4', '#ff1493', '#dc143c']
  },
  {
    id: 2,
    type: 'tip',
    title: '💡 Pro Tip Alert!',
    message: 'Categories are your secret weapon! Use them to find your tribe 🔥',
    timeAgo: '1 hour ago',
    isNew: true,
    icon: Zap,
    gradient: ['#ffa726', '#ff7043', '#f4511e']
  },
  {
    id: 3,
    type: 'reminder',
    title: '🔒 Privacy Shield Active',
    message: 'Your identity is locked down tight. Share freely, worry never! 🛡️',
    timeAgo: '1 day ago',
    isNew: false,
    icon: BellOff,
    gradient: ['#a020f0', '#8a2be2', '#7b68ee']
  },
  {
    id: 4,
    type: 'feature',
    title: '🚀 New Feature Unlocked',
    message: 'Categories just landed! Organize your secrets like a pro 📂',
    timeAgo: '3 days ago',
    isNew: false,
    icon: Star,
    gradient: ['#00bfff', '#1e90ff', '#4169e1']
  },
  {
    id: 5,
    type: 'motivation',
    title: '🌟 You\'re Amazing!',
    message: 'Thanks for being part of our secret community. Keep shining! ✨',
    timeAgo: '1 week ago',
    isNew: false,
    icon: Heart,
    gradient: ['#32cd32', '#228b22', '#006400']
  }
];

// Floating particles for background animation
function FloatingParticle({ delay = 0, size = 20, color = '#ff69b4' }) {
  const translateY = useSharedValue(height);
  const translateX = useSharedValue(Math.random() * width);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    const startAnimation = () => {
      translateY.value = height;
      translateX.value = Math.random() * width;
      opacity.value = 0;
      scale.value = 0;

      translateY.value = withTiming(-100, { 
        duration: 8000 + Math.random() * 4000,
        easing: Easing.linear 
      });
      
      opacity.value = withSequence(
        withTiming(0.6, { duration: 1000 }),
        withTiming(0.6, { duration: 6000 }),
        withTiming(0, { duration: 1000 })
      );

      scale.value = withSequence(
        withSpring(1, { damping: 10 }),
        withTiming(1, { duration: 6000 }),
        withSpring(0, { damping: 10 })
      );
    };

    const timer = setTimeout(() => {
      startAnimation();
      const interval = setInterval(startAnimation, 3000 + Math.random() * 2000);
      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.particle, { width: size, height: size }, animatedStyle]}>
      <LinearGradient
        colors={[color, color + '80', 'transparent']}
        style={styles.particleGradient}
      />
    </Animated.View>
  );
}

function NotificationCard({ notification, index }) {
  const cardOpacity = useSharedValue(0);
  const cardScale = useSharedValue(1);
  const glowAnimation = useSharedValue(1);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { 
      duration: 600,
      easing: Easing.out(Easing.quad)
    });

    if (notification.isNew) {
      glowAnimation.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      );
    }
  }, []);

  const handlePress = () => {
    cardScale.value = withSequence(
      withSpring(0.95, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );
  };

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { translateY: interpolate(cardOpacity.value, [0, 1], [50, 0]) },
      { scale: cardScale.value * glowAnimation.value }
    ],
  }));

  const IconComponent = notification.icon;
  const isNew = notification.isNew;

  return (
    <Animated.View 
      style={[styles.notificationCard, cardAnimatedStyle]}
      entering={FadeInDown.delay(index * 150).springify()}
    >
      <TouchableOpacity onPress={handlePress} style={styles.cardTouchable}>
        <LinearGradient
          colors={isNew ? notification.gradient : ['rgba(17, 17, 17, 0.95)', 'rgba(0, 0, 0, 0.8)']}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {isNew && (
            <View style={styles.shimmerOverlay}>
              <LinearGradient
                colors={['transparent', 'rgba(255, 255, 255, 0.2)', 'transparent']}
                style={styles.shimmer}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          )}
          
          <View style={styles.cardContent}>
            <View style={[
              styles.iconContainer, 
              { backgroundColor: isNew ? 'rgba(255, 255, 255, 0.2)' : '#333333' + '40' }
            ]}>
              <IconComponent size={24} color={isNew ? '#ffffff' : '#666666'} />
            </View>
            
            <View style={styles.textContainer}>
              <View style={styles.titleRow}>
                <Text style={[styles.notificationTitle, { color: isNew ? '#ffffff' : '#ffffff' }]}>
                  {notification.title}
                </Text>
                {isNew && (
                  <Animated.View 
                    style={styles.newBadge}
                    entering={BounceIn.delay(index * 150 + 300)}
                  >
                    <Text style={styles.newBadgeText}>NEW</Text>
                  </Animated.View>
                )}
              </View>
              <Text style={[styles.notificationMessage, { color: isNew ? '#ffffff' : '#cccccc' }]}>
                {notification.message}
              </Text>
              <Text style={styles.timeAgo}>{notification.timeAgo}</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

function QuickAction({ title, subtitle, icon: Icon, onPress, gradient = ['#ff69b4', '#a020f0'], index = 0 }) {
  const actionScale = useSharedValue(1);
  const actionOpacity = useSharedValue(0);

  useEffect(() => {
    actionOpacity.value = withTiming(1, { 
      duration: 600,
      easing: Easing.out(Easing.quad)
    });
  }, []);

  const handlePress = () => {
    actionScale.value = withSequence(
      withSpring(0.92, { damping: 15 }),
      withSpring(1, { damping: 15 })
    );
    onPress?.();
  };

  const actionAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: actionScale.value },
      { translateX: interpolate(actionOpacity.value, [0, 1], [-50, 0]) }
    ],
    opacity: actionOpacity.value,
  }));

  return (
    <Animated.View 
      style={actionAnimatedStyle}
      entering={SlideInRight.delay(index * 100).springify()}
    >
      <TouchableOpacity style={styles.quickAction} onPress={handlePress}>
        <LinearGradient
          colors={gradient}
          style={styles.actionGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.actionContent}>
            <View style={styles.actionIcon}>
              <Icon size={20} color="#ffffff" />
            </View>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{title}</Text>
              <Text style={styles.actionSubtitle}>{subtitle}</Text>
            </View>
            <View style={styles.actionArrow}>
              <Text style={styles.arrowText}>›</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function NotificationsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const headerOpacity = useSharedValue(0);
  const sunRotation = useSharedValue(0);
  const sparkleScale = useSharedValue(1);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    
    sunRotation.value = withRepeat(
      withTiming(360, { duration: 20000, easing: Easing.linear }),
      -1,
      false
    );

    sparkleScale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [
      { translateY: interpolate(headerOpacity.value, [0, 1], [-30, 0]) }
    ],
  }));

  const sunAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sunRotation.value}deg` }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sparkleScale.value }],
  }));

  const newNotificationsCount = notifications.filter(n => n.isNew).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Floating Particles Background */}
      <View style={styles.particlesContainer}>
        <FloatingParticle delay={0} size={15} color="#ff69b4" />
        <FloatingParticle delay={1000} size={20} color="#ffa726" />
        <FloatingParticle delay={2000} size={12} color="#a020f0" />
        <FloatingParticle delay={3000} size={18} color="#00bfff" />
        <FloatingParticle delay={4000} size={16} color="#32cd32" />
      </View>
      
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <LinearGradient
          colors={['#000000', 'rgba(255, 105, 180, 0.1)', 'rgba(0,0,0,0.8)']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>UPDATES</Text>
              <Animated.View style={sunAnimatedStyle}>
                <Sun size={28} color="#ffa726" />
              </Animated.View>
              <Animated.View style={sparkleAnimatedStyle}>
                <Sparkles size={20} color="#ff69b4" />
              </Animated.View>
              {newNotificationsCount > 0 && (
                <Animated.View 
                  style={styles.notificationBadge}
                  entering={ZoomIn.delay(500).springify()}
                >
                  <Text style={styles.badgeText}>{newNotificationsCount}</Text>
                </Animated.View>
              )}
            </View>
            <Text style={styles.headerSubtitle}>Sunshine & good vibes ☀️✨</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Quick Actions */}
        <View style={styles.section}>
          <Animated.Text 
            style={styles.sectionTitle}
            entering={FadeInDown.delay(200)}
          >
            ⚡ QUICK ACTIONS
          </Animated.Text>
          
          <QuickAction
            title="Notification Settings"
            subtitle="Customize your experience"
            icon={Settings}
            onPress={() => console.log('Settings')}
            gradient={['#a020f0', '#8a2be2', '#7b68ee']}
            index={0}
          />
          
          <QuickAction
            title={notificationsEnabled ? "Pause Notifications" : "Enable Notifications"}
            subtitle={notificationsEnabled ? "Take a break from updates" : "Stay in the loop"}
            icon={notificationsEnabled ? BellOff : Bell}
            onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            gradient={notificationsEnabled ? ['#666666', '#444444'] : ['#ff69b4', '#ff1493']}
            index={1}
          />
        </View>

        {/* Notifications List */}
        <View style={styles.section}>
          <Animated.Text 
            style={styles.sectionTitle}
            entering={FadeInDown.delay(400)}
          >
            🌟 LATEST UPDATES
          </Animated.Text>
          
          {notifications.map((notification, index) => (
            <NotificationCard 
              key={notification.id} 
              notification={notification} 
              index={index} 
            />
          ))}
        </View>

        {/* Enhanced Info Section */}
        <Animated.View 
          style={styles.infoSection}
          entering={FadeInDown.delay(1000).springify()}
        >
          <LinearGradient
            colors={['#ff69b4', '#ffa726', '#a020f0']}
            style={styles.infoGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.infoContent}>
              <View style={styles.infoHeader}>
                <Text style={styles.infoTitle}>🔒 Privacy Promise</Text>
                <Heart size={20} color="#ffffff" />
              </View>
              <Text style={styles.infoText}>
                Zero tracking, zero data collection, 100% anonymity. 
                We're here to brighten your day, not invade your privacy! ✨
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  particlesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
  },
  particleGradient: {
    flex: 1,
    borderRadius: 50,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
    textShadowColor: '#ff69b4',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ffa726',
    fontStyle: 'italic',
    textShadowColor: '#ffa726',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: -8,
    right: -15,
    backgroundColor: '#ff1493',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff1493',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 5,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  content: {
    flex: 1,
    zIndex: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
    marginBottom: 20,
    textShadowColor: '#ff69b4',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  quickAction: {
    borderRadius: 20,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  actionGradient: {
    padding: 18,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  actionSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
  actionArrow: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '300',
  },
  notificationCard: {
    borderRadius: 20,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  cardTouchable: {
    flex: 1,
  },
  cardGradient: {
    padding: 18,
    position: 'relative',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  shimmer: {
    flex: 1,
    transform: [{ skewX: '-20deg' }],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 15,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
  },
  newBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  newBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 10,
  },
  timeAgo: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontStyle: 'italic',
  },
  infoSection: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#ff69b4',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  infoGradient: {
    padding: 25,
  },
  infoContent: {
    alignItems: 'center',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  infoTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  infoText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 22,
    textAlign: 'center',
    opacity: 0.9,
  },
  bottomPadding: {
    height: 100,
  },
});