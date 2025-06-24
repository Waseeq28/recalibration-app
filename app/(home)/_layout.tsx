import { Stack } from "expo-router";
import { MenuIcon, SunIcon, MoonIcon } from "lucide-react-native";
import { TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import "../../global.css";

export default function HomeScreenLayout() {
  const { colors, toggleTheme, theme } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitleStyle: {
          color: colors.text.secondary,
          fontSize: 15,
          fontWeight: "500",
        },
        headerShadowVisible: false,
        headerLeft: () => (
          <TouchableOpacity className="rounded-full h-10 w-10 flex items-center justify-center ml-1">
            <MenuIcon size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <TouchableOpacity
            onPress={toggleTheme}
            className="rounded-full h-10 w-10 flex items-center justify-center mr-1"
          >
            {theme === "dark" ? (
              <SunIcon size={24} color={colors.text.secondary} />
            ) : (
              <MoonIcon size={24} color={colors.text.secondary} />
            )}
          </TouchableOpacity>
        ),
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: "User", headerShown: false }}
      />
    </Stack>
  );
}
