import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import MessageInput from "./components/message-input";
import MessageListing from "./components/message-listing";
import { Message } from "@/lib/db/schemas/message.schema";
import { useMessageOperations } from "@/lib/db/hooks/useMessageOperations";
import { format } from "date-fns";

export default function AiChatTab() {
  const { colors } = useTheme();
  const { addMessage, getMessagesByDate, isLoading } = useMessageOperations();
  const [messages, setMessages] = useState<Message[]>([]);

  // Get today's date for filtering messages
  const today = format(new Date(), "MMM d, yyyy");

  useEffect(() => {
    const fetchMessages = async () => {
      if (!isLoading) {
        const todayMessages = await getMessagesByDate(today);
        setMessages(todayMessages);
      }
    };

    fetchMessages();
  }, [getMessagesByDate, today, isLoading]);

  const handleSendMessage = async (content: string, isAiEnabled: boolean) => {
    // Add user message to database
    const messageId = await addMessage(content, false);

    if (messageId) {
      // Refresh messages to show the new one
      const updatedMessages = await getMessagesByDate(today);
      setMessages(updatedMessages);

      // Simulate AI response after a short delay
      if (isAiEnabled) {
        setTimeout(async () => {
          const aiResponse = "That's interesting! Tell me more about that.";
          await addMessage(aiResponse, true);

          // Refresh messages again to show AI response
          const finalMessages = await getMessagesByDate(today);
          setMessages(finalMessages);
        }, 1000);
      }
    }
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
