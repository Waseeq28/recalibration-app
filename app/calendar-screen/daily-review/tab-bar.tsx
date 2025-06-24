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

  const TabButton = ({
    tabType,
    label,
  }: {
    tabType: TabType;
    label: string;
  }) => {
    const isActive = activeTab === tabType;

    return (
      <TouchableOpacity
        className="flex-1 items-center justify-center py-2 px-3 rounded-t-xl"
        style={{
          backgroundColor: isActive ? colors.text.accent : "transparent",
          opacity: isActive ? 0.8 : 1,
          borderBottomWidth: 1,
          borderBottomColor: colors.border.light,
        }}
        onPress={() => onTabChange(tabType)}
        activeOpacity={0.8}
      >
        <Text
          className="text-sm font-medium"
          style={{
            color: isActive ? "#ffffff" : colors.text.secondary,
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-row py-1 px-1">
      <TabButton tabType="ai-chat" label="AI Chat" />
      <TabButton tabType="emotional-profile" label="Emotion Profile" />
    </View>
  );
}
