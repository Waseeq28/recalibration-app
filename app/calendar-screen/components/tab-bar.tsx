import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

type TabType = "ai-chat" | "emotional-profile";

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const { colors } = useTheme();

  return (
    <View className="flex-row py-1">
      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center py-2 px-3 mx-1"
        style={{
          borderBottomWidth: activeTab === "ai-chat" ? 1 : 0,
          borderBottomColor:
            activeTab === "ai-chat" ? colors.text.primary : "transparent",
        }}
        onPress={() => onTabChange("ai-chat")}
        activeOpacity={0.7}
      >
        <Text
          className="text-sm font-medium"
          style={{
            color:
              activeTab === "ai-chat"
                ? colors.text.primary
                : colors.text.secondary,
          }}
        >
          AI Chat
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-1 flex-row items-center justify-center py-2 px-3 mx-1"
        style={{
          borderBottomWidth: activeTab === "emotional-profile" ? 1 : 0,
          borderBottomColor:
            activeTab === "emotional-profile"
              ? colors.text.primary
              : "transparent",
        }}
        onPress={() => onTabChange("emotional-profile")}
        activeOpacity={0.7}
      >
        <Text
          className="text-sm font-medium"
          style={{
            color:
              activeTab === "emotional-profile"
                ? colors.text.primary
                : colors.text.secondary,
          }}
        >
          Emotion Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}
