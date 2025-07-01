import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const segments = useSegments();

  useEffect(() => {
    const checkVisited = async () => {
      try {
        const visited = await AsyncStorage.getItem('visited');
        const isAtRoot = segments.length === 0;

        if (!visited && isAtRoot) {
          await AsyncStorage.setItem('visited', 'true');
          router.replace('/welcome');
        }
      } catch (e) {
        console.log('AsyncStorage error:', e);
      } finally {
        setLoading(false);
      }
    };

    checkVisited();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
        <ActivityIndicator size="large" color="#ff69b4" />
      </View>
    );
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
