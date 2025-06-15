import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { View, TouchableOpacity, Text } from "react-native";
import { ArrowLeftIcon, BellIcon, CalendarIcon } from "lucide-react-native";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useState, useCallback } from "react";

export default function CalendarScreenLayout() {
  const router = useRouter();
  const { colors } = useTheme();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleBack = useCallback(() => {
    if (isNavigating) return;

    setIsNavigating(true);
    router.back();
    setTimeout(() => setIsNavigating(false), 300);
  }, [isNavigating]);

  const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

  const headerOptions = {
    headerStyle: {
      backgroundColor: colors.background,
    },
    headerTitleStyle: {
      color: colors.text.primary,
      fontSize: 18,
      fontWeight: "600" as const,
    },
    headerShadowVisible: false,
    headerLeft: () => (
      <TouchableOpacity
        onPress={handleBack}
        className="rounded-full h-10 w-10 flex items-center justify-center mr-1"
        delayPressIn={0}
        activeOpacity={0.7}
        hitSlop={hitSlop}
      >
        <ArrowLeftIcon size={24} color={colors.text.primary} />
      </TouchableOpacity>
    ),
    headerRight: () => (
      <View className="flex-row items-center gap-2 mr-1">
        <TouchableOpacity
          className="rounded-full h-10 w-10 flex items-center justify-center"
          delayPressIn={0}
          activeOpacity={0.7}
          hitSlop={hitSlop}
        >
          <CalendarIcon size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>
    ),
  };

  return (
    <SafeAreaProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}
