import { Tabs } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Home, Plus, MessageCircle, Search, User } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

function TabBarIcon({ name, color, focused }) {
  const iconSize = focused ? 28 : 24;
  const iconColor = focused ? '#ff69b4' : color;
  
  const IconComponent = {
    home: Home,
    plus: Plus,
    comments: MessageCircle,
    explore: Search,
    profile: User,
  }[name];

  if (!IconComponent) return null;

  return (
    <View style={[styles.tabIconContainer, focused && styles.tabIconFocused]}>
      {focused && (
        <LinearGradient
          colors={['#ff69b4', '#a020f0']}
          style={styles.tabIconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      )}
      <IconComponent 
        size={iconSize} 
        color={iconColor} 
        strokeWidth={focused ? 2.5 : 2}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 1,
          borderTopColor: '#ff69b4',
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
          paddingTop: 10,
          elevation: 20,
          shadowColor: '#ff69b4',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.3,
          shadowRadius: 15,
        },
        tabBarActiveTintColor: '#ff69b4',
        tabBarInactiveTintColor: '#666666',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          letterSpacing: 0.5,
          marginTop: 5,
        },
        tabBarItemStyle: {
          paddingVertical: 5,
        },
      }}>
      
      <Tabs.Screen
        name="feed"
        options={{
          title: 'feed',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="home" color={color} focused={focused} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="create"
        options={{
          title: 'Drop',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="plus" color={color} focused={focused} />
          ),
        }}
      />
      
  
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="explore" color={color} focused={focused} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'You',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name="profile" color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    position: 'relative',
  },
  tabIconFocused: {
    transform: [{ scale: 1.1 }],
  },
  tabIconGradient: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0.2,
  },
});