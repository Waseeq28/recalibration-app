import React from "react";
import { View, ScrollView } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import ProfileSections from "./components/profile-sections";
import { sampleEmotionProfile } from "./data/sample-data";

interface EmotionProfileTabProps {
  selectedDate: string;
}

export default function EmotionProfileTab({
  selectedDate,
}: EmotionProfileTabProps) {
  const { colors } = useTheme();
  // TODO: Replace with actual data extraction from AI conversations
  const emotionData = sampleEmotionProfile;

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: colors.background,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
      }}
    >
      <ScrollView className="flex-1 p-2" showsVerticalScrollIndicator={false}>
        <ProfileSections data={emotionData} />
      </ScrollView>
    </View>
  );
}
