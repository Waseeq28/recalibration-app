import "react-native-get-random-values";
import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PortalHost } from "@rn-primitives/portal";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(home)" />
        <Stack.Screen name="calendar-screen" />
      </Stack>
      <PortalHost />
    </ThemeProvider>
  );
}
