import { Stack } from "expo-router";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { PortalHost } from "@rn-primitives/portal";
import { RxDbProvider } from "@/lib/db/RxDbProvider";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RxDbProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(home)" />
          <Stack.Screen name="scribble-screen" />
        </Stack>
        <PortalHost />
      </RxDbProvider>
    </ThemeProvider>
  );
}
