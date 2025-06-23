import "@/polyfills";
import "react-native-get-random-values";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/lib/auth/context/AuthContext";
import { PortalHost } from "@rn-primitives/portal";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SafeAreaProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(home)" />
            <Stack.Screen name="calendar-screen" />
            <Stack.Screen name="auth/callback" />
          </Stack>
          <PortalHost />
        </SafeAreaProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
