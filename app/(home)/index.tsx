import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "expo-router";
import { CalendarIcon } from "lucide-react-native";
import AuthSection from "@/lib/auth/components/AuthSection";

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 justify-center items-center p-4"
      style={{ backgroundColor: colors.background }}
    >
      {/* Authentication Section */}
      <AuthSection />

      {/* Navigation Section */}
      <View className="w-full max-w-xs">
        <Link href="/calendar-screen" asChild>
          <TouchableOpacity
            className="flex-row items-center justify-center mb-4 py-4 rounded-xl"
            style={{ backgroundColor: colors.surface.button }}
          >
            <CalendarIcon size={20} color={colors.text.secondary} />
            <Text
              className="ml-2 text-base font-medium"
              style={{ color: colors.text.secondary }}
            >
              Calendar View
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
