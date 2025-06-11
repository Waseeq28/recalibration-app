import React, { useState } from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import MessageInput from "./ai-chat-components/message-input";
import MessageListing from "./ai-chat-components/message-listing";
import { Message } from "./ai-chat-components/message-card";

export default function AiChatTab() {
  const { colors } = useTheme();

  // Hardcoded sample messages for demonstration
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "text" as const,
      content: "How was your day today?",
      timestamp: "2:30 PM",
      isAiGenerated: true,
    },
    {
      id: "2",
      type: "text" as const,
      content:
        "It was pretty good! I had a productive meeting this morning and finished some important tasks.",
      timestamp: "2:32 PM",
      isAiGenerated: false,
    },
    {
      id: "3",
      type: "text" as const,
      content:
        "That sounds wonderful! What made the meeting particularly productive? I'd love to help you reflect on what worked well.",
      timestamp: "2:33 PM",
      isAiGenerated: true,
    },
  ]);

  const handleSendMessage = (content: string, isAiEnabled: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type: "text",
      content,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isAiGenerated: false,
    };

    // Add user message
    setMessages((prevMessages) => [...prevMessages, newMessage]);

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "text",
        content: "That's interesting! Tell me more about that.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isAiGenerated: true,
      };

      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    }, 1000);
  };

  return (
    <View
      className="flex-1"
      style={{ backgroundColor: colors.background, borderRadius: 16 }}
    >
      <MessageListing messages={messages} />
      <View className="p-1">
        <MessageInput onSendMessage={handleSendMessage} />
      </View>
    </View>
  );
}
