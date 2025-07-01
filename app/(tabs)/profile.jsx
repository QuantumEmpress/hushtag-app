import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Switch,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  FadeInDown,
  FadeInUp,
  SlideInLeft,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  Moon, 
  Eye, 
  EyeOff, 
  Crown, 
  Flame, 
  Heart,
  MessageCircle,
  TrendingUp,
  Award,
  Lock
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

// Mock user stats
const userStats = {
  secretsDropped: 47,
  totalLikes: 2340,
  totalComments: 567,
  streakDays: 12,
  rank: 'Secret Keeper',
  level: 8
};

// Mock recent activity
const recentActivity = [
  {
    id: 1,
    type: 'post',
    content: "Your secret about office drama got 234 likes! 🔥",
    timeAgo: "2h ago",
    icon: Heart,
    color: '#ff69b4'
  },
  {
    id: 2,
    type: 'comment',
    content: "Someone replied to your confession thread",
    timeAgo: "5h ago",
    icon: MessageCircle,
    color: '#a020f0'
  },
  {
    id: 3,
    type: 'achievement',
    content: "Achievement unlocked: Truth Teller (10 posts)",
    timeAgo: "1d ago",
    icon: Award,
    color: '#ffa726'
  }
];

function StatCard({ title, value, icon: Icon, color, index }) {
  const cardOpacity = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { 
      duration: 600,
      easing: Easing.out(Easing.quad)
    });

    pulseAnimation.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      false
    );
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { translateY: interpolate(cardOpacity.value, [0, 1], [30, 0]) },
      { scale: pulseAnimation.value }
    ],
  }));

  return (
    <Animated.View 
      style={[styles.statCard, cardAnimatedStyle]}
      entering={FadeInDown.delay(index * 100).springify()}
    >
      <LinearGradient
        colors={color}
        style={styles.statGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Icon size={24} color="#ffffff" />
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

function ActivityCard({ activity, index }) {
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    cardOpacity.value = withTiming(1, { 
      duration: 600,
      easing: Easing.out(Easing.quad)
    });
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [
      { translateX: interpolate(cardOpacity.value, [0, 1], [-50, 0]) }
    ],
  }));

  return (
    <Animated.View 
      style={[styles.activityCard, cardAnimatedStyle]}
      entering={SlideInLeft.delay(index * 150).springify()}
    >
      <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
        <activity.icon size={20} color={activity.color} />
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>{activity.content}</Text>
        <Text style={styles.activityTime}>{activity.timeAgo}</Text>
      </View>
    </Animated.View>
  );
}

function SettingItem({ title, subtitle, icon: Icon, hasSwitch, switchValue, onSwitchChange, onPress, showArrow = true }) {
  const itemScale = useSharedValue(1);

  const handlePress = () => {
    if (onPress) {
      itemScale.value = withSequence(
        withTiming(0.98, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      onPress();
    }
  };

  const itemAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: itemScale.value }],
  }));

  return (
    <Animated.View style={itemAnimatedStyle}>
      <TouchableOpacity 
        style={styles.settingItem}
        onPress={handlePress}
        disabled={hasSwitch}
      >
        <View style={styles.settingLeft}>
          <View style={styles.settingIconContainer}>
            <Icon size={20} color="#ff69b4" />
          </View>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>{title}</Text>
            {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
          </View>
        </View>
        
        {hasSwitch ? (
          <Switch
            value={switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#333333', true: '#ff69b4' }}
            thumbColor={switchValue ? '#ffffff' : '#666666'}
          />
        ) : showArrow && (
          <Text style={styles.settingArrow}>›</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const [anonymousMode, setAnonymousMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  
  const headerOpacity = useSharedValue(0);
  const crownRotation = useSharedValue(0);

  useEffect(() => {
    headerOpacity.value = withTiming(1, { duration: 800 });
    crownRotation.value = withRepeat(
      withSequence(
        withTiming(10, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(-10, { duration: 1000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.sin) })
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

  const crownAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${crownRotation.value}deg` }],
  }));

  const stats = [
    { title: 'Secrets', value: userStats.secretsDropped, icon: Flame, color: ['#ff69b4', '#ff1493'] },
    { title: 'Likes', value: userStats.totalLikes, icon: Heart, color: ['#a020f0', '#8a2be2'] },
    { title: 'Comments', value: userStats.totalComments, icon: MessageCircle, color: ['#00bfff', '#1e90ff'] },
    { title: 'Streak', value: `${userStats.streakDays}d`, icon: TrendingUp, color: ['#32cd32', '#228b22'] },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      
      {/* Header */}
      <Animated.View style={[styles.header, headerAnimatedStyle]}>
        <LinearGradient
          colors={['#000000', 'rgba(0,0,0,0.8)']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <Text style={styles.headerTitle}>YOU</Text>
              <Animated.View style={crownAnimatedStyle}>
                <Crown size={24} color="#ff69b4" />
              </Animated.View>
            </View>
            <Text style={styles.headerSubtitle}>Your secret kingdom 👑</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <Animated.View 
          style={styles.profileSection}
          entering={FadeInUp.delay(200)}
        >
          <LinearGradient
            colors={['#ff69b4', '#a020f0']}
            style={styles.profileGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.profileContent}>
              <View style={styles.avatarContainer}>
                <LinearGradient
                  colors={['#ffffff', '#f0f0f0']}
                  style={styles.avatar}
                >
                  <User size={40} color="#333333" />
                </LinearGradient>
              </View>
              
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>Anonymous User</Text>
                <Text style={styles.profileRank}>{userStats.rank} • Level {userStats.level}</Text>
                <View style={styles.profileBadge}>
                  <Lock size={12} color="#ffffff" />
                  <Text style={styles.profileBadgeText}>100% Anonymous</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Stats Grid */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>📊 YOUR STATS</Text>
          <View style={styles.statsGrid}>
            {stats.map((stat, index) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                index={index}
              />
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚡ RECENT ACTIVITY</Text>
          {recentActivity.map((activity, index) => (
            <ActivityCard key={activity.id} activity={activity} index={index} />
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ SETTINGS</Text>
          
          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>Privacy</Text>
            <SettingItem
              title="Anonymous Mode"
              subtitle="Hide your identity completely"
              icon={anonymousMode ? EyeOff : Eye}
              hasSwitch={true}
              switchValue={anonymousMode}
              onSwitchChange={setAnonymousMode}
            />
            <SettingItem
              title="Privacy Settings"
              subtitle="Manage your data and visibility"
              icon={Shield}
              onPress={() => console.log('Privacy settings')}
            />
          </View>

          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>Preferences</Text>
            <SettingItem
              title="Notifications"
              subtitle="Get notified about interactions"
              icon={Bell}
              hasSwitch={true}
              switchValue={notifications}
              onSwitchChange={setNotifications}
            />
            <SettingItem
              title="Dark Mode"
              subtitle="Always on for maximum secrecy"
              icon={Moon}
              hasSwitch={true}
              switchValue={darkMode}
              onSwitchChange={setDarkMode}
            />
          </View>

          <View style={styles.settingsGroup}>
            <Text style={styles.groupTitle}>General</Text>
            <SettingItem
              title="App Settings"
              subtitle="Customize your experience"
              icon={Settings}
              onPress={() => console.log('App settings')}
            />
          </View>
        </View>

        {/* Footer */}
        <Animated.View 
          style={styles.footer}
          entering={FadeInUp.delay(1000)}
        >
          <Text style={styles.footerText}>built by Omalili ♛</Text>
          <Text style={styles.footerSubtext}>Keep your secrets safe 🔒</Text>
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
    gap: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#ffffff',
    letterSpacing: 2,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ff69b4',
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    margin: 20,
    borderRadius: 25,
    overflow: 'hidden',
  },
  profileGradient: {
    padding: 25,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  avatarContainer: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 5,
  },
  profileRank: {
    color: '#ffffff',
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 10,
  },
  profileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
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
  },
  statsSection: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  statCard: {
    width: (width - 60) / 2,
    borderRadius: 20,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  statValue: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  statTitle: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    gap: 15,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    color: '#ffffff',
    fontSize: 14,
    marginBottom: 5,
  },
  activityTime: {
    color: '#666666',
    fontSize: 12,
  },
  settingsGroup: {
    marginBottom: 30,
  },
  groupTitle: {
    color: '#ff69b4',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111111',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 15,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 105, 180, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    color: '#666666',
    fontSize: 12,
  },
  settingArrow: {
    color: '#666666',
    fontSize: 24,
    fontWeight: '300',
  },
  footer: {
    alignItems: 'center',
    padding: 30,
  },
  footerText: {
    color: '#ff69b4',
    fontSize: 14,
    fontStyle: 'italic',
    letterSpacing: 1,
    marginBottom: 5,
  },
  footerSubtext: {
    color: '#666666',
    fontSize: 12,
  },
  bottomPadding: {
    height: 100,
  },
});