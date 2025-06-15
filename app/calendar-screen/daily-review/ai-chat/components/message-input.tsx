import React, { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/contexts/ThemeContext";
import { ArrowRightIcon } from "lucide-react-native";

type MessageInputProps = {
  onSendMessage: (content: string, isAiEnabled: boolean) => void;
  isAiThinking?: boolean;
};

export default function MessageInput({
  onSendMessage,
  isAiThinking = false,
}: MessageInputProps) {
  const { colors } = useTheme();
  const [text, setText] = useState("");

  const handleSend = () => {
    const trimmedText = text.trim();
    if (trimmedText) {
      onSendMessage(trimmedText, true);
      setText("");
    }
  };

  return (
    <View style={{ borderRadius: 16 }}>
      <LinearGradient
        colors={colors.gradients.card.outer}
        start={{ x: 0.9, y: 0.5 }}
        end={{ x: 0.1, y: 0.5 }}
        className="rounded-xl overflow-hidden"
      >
        <LinearGradient
          colors={colors.gradients.card.inner}
          start={{ x: 0.9, y: 0.5 }}
          end={{ x: 0.1, y: 0.5 }}
          className="px-4 py-3 rounded-xl"
        >
          <View className="flex-row items-center">
            <TextInput
              className="flex-1 py-2"
              style={{ color: colors.text.primary }}
              multiline
              numberOfLines={3}
              onChangeText={setText}
              value={text}
              placeholder={
                isAiThinking
                  ? "AI is thinking..."
                  : "Ask me anything about your day..."
              }
              placeholderTextColor={colors.text.tertiary}
              editable={!isAiThinking}
              textAlignVertical="top"
            />
            {text.trim() && (
              <TouchableOpacity
                className="rounded-full h-8 w-8 flex items-center justify-center ml-2"
                onPress={handleSend}
              >
                <ArrowRightIcon size={20} color={colors.text.secondary} />
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </LinearGradient>
    </View>
  );
}
