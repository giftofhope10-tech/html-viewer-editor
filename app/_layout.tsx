import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAppFonts } from '@/hooks/useAppFonts';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '@/lib/theme';
import { AppProvider } from '@/context/AppContext';

export default function RootLayout() {
  useFrameworkReady();
  const { fontsLoaded, fontError } = useAppFonts();

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="about" options={{ headerShown: true, title: 'About Us', headerTintColor: Colors.dark[900], headerStyle: { backgroundColor: Colors.white }, headerBackTitle: 'Back' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.white },
});
