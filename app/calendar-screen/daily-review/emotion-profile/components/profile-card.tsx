import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";

interface ProfileCardProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}

export default function ProfileCard({
  icon,
  title,
  children,
  rightElement,
}: ProfileCardProps) {
  const { colors } = useTheme();

  return (
    <View
      className="mb-2 rounded-xl overflow-hidden"
      style={{ backgroundColor: colors.border.light }}
    >
      <LinearGradient
        colors={colors.gradients.card.outer}
        start={{ x: 0.9, y: 0.5 }}
        end={{ x: 0.1, y: 0.5 }}
      >
        <LinearGradient
          colors={colors.gradients.card.inner}
          start={{ x: 0.9, y: 0.5 }}
          end={{ x: 0.1, y: 0.5 }}
          className="rounded-xl p-5"
        >
          <View className="flex-row items-start">
            <View className="mr-4 mt-1">{icon}</View>
            <View className="flex-1">
              <View className="flex-row items-center justify-between mb-3">
                <Text
                  className="text-base font-bold"
                  style={{ color: colors.text.accent }}
                >
                  {title}
                </Text>
                {rightElement}
              </View>
              {children}
            </View>
          </View>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}
