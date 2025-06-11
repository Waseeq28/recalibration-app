import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";

export interface Message {
  id: string;
  type: "text";
  content: string;
  timestamp: string;
  isAiGenerated: boolean;
}

interface MessageCardProps extends Message {}

export default function MessageCard(props: MessageCardProps) {
  const { colors } = useTheme();
  const { timestamp, isAiGenerated, content } = props;

  const containerAlignment = isAiGenerated ? "flex-start" : "flex-end";
  const outerGradient = isAiGenerated
    ? colors.gradients.card.aiOuter
    : colors.gradients.card.outer;
  const innerGradient = isAiGenerated
    ? colors.gradients.card.aiInner
    : colors.gradients.card.inner;

  return (
    <View
      className="flex flex-row"
      style={{ justifyContent: containerAlignment }}
    >
      <View
        className="max-w-[95%] rounded-xl overflow-hidden"
        style={{ backgroundColor: colors.border.light }}
      >
        <LinearGradient
          colors={outerGradient}
          start={{ x: 0.9, y: 0.5 }}
          end={{ x: 0.1, y: 0.5 }}
        >
          <LinearGradient
            colors={innerGradient}
            start={{ x: 0.9, y: 0.5 }}
            end={{ x: 0.1, y: 0.5 }}
            className="rounded-xl p-3"
          >
            <Text
              className="text-base leading-6 mb-2"
              style={{ color: colors.text.primary }}
            >
              {content}
            </Text>
            {/* <Text style={{ color: colors.text.tertiary }} className="text-xs">
              {timestamp}
            </Text> */}
          </LinearGradient>
        </LinearGradient>
      </View>
    </View>
  );
}
