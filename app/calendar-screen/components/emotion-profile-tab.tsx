import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { HeartIcon } from "lucide-react-native";

export default function EmotionProfileTab() {
  const { colors } = useTheme();

  return (
    <View className="flex-1 p-4">
      <View className="flex-1 justify-center items-center">
        <HeartIcon size={40} color={colors.text.secondary} />
        <Text
          className="text-base mt-4 text-center"
          style={{ color: colors.text.secondary }}
        >
          Track and understand your emotional journey
        </Text>
      </View>
    </View>
  );
}
