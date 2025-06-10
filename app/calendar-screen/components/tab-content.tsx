import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { MessageCircleIcon, HeartIcon } from "lucide-react-native";

type TabType = "ai-chat" | "emotional-profile";

interface TabContentProps {
  activeTab: TabType;
}

export default function TabContent({ activeTab }: TabContentProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-1 p-4">
      {activeTab === "ai-chat" ? (
        <View className="flex-1 justify-center items-center">
          <MessageCircleIcon size={40} color={colors.text.secondary} />
          <Text
            className="text-base mt-4 text-center"
            style={{ color: colors.text.secondary }}
          >
            Reflect on your day and get personalized insights
          </Text>
        </View>
      ) : (
        <View className="flex-1 justify-center items-center">
          <HeartIcon size={40} color={colors.text.secondary} />
          <Text
            className="text-base mt-4 text-center"
            style={{ color: colors.text.secondary }}
          >
            Track and understand your emotional journey
          </Text>
        </View>
      )}
    </View>
  );
}
