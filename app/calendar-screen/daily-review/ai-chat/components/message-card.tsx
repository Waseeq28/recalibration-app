import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { Message } from "ai/react";

interface MessageCardProps extends Message {}

export default function MessageCard(props: MessageCardProps) {
  const { colors } = useTheme();
  const { role, content, createdAt } = props;

  const isAiGenerated = role === "assistant";

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
            {createdAt && (
              <Text style={{ color: colors.text.tertiary }} className="text-xs">
                {new Date(createdAt).toLocaleTimeString()}
              </Text>
            )}
          </LinearGradient>
        </LinearGradient>
      </View>
    </View>
  );
}
