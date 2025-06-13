import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import MessageInput from "./components/message-input";
import MessageListing from "./components/message-listing";
import { Message } from "@/lib/db/schemas/message.schema";
import { useMessageOperations } from "@/lib/db/hooks/useMessageOperations";
import { format } from "date-fns";

interface AiChatTabProps {
  selectedDate: string;
}

export default function AiChatTab({ selectedDate }: AiChatTabProps) {
  const { colors } = useTheme();
  const { addMessage, getMessagesByDate, isLoading } = useMessageOperations();
  const [messages, setMessages] = useState<Message[]>([]);

  // Convert selectedDate (YYYY-MM-DD) to the format used in database (MMM d, yyyy)
  const formattedDate = format(new Date(selectedDate), "MMM d, yyyy");

  useEffect(() => {
    const fetchMessages = async () => {
      if (!isLoading) {
        const dateMessages = await getMessagesByDate(formattedDate);
        setMessages(dateMessages);
      }
    };

    fetchMessages();
  }, [getMessagesByDate, formattedDate, isLoading]);

  const handleSendMessage = async (content: string, isAiEnabled: boolean) => {
    // Add user message to database with selected date
    const messageId = await addMessage(content, false, "text", formattedDate);

    if (messageId) {
      // Refresh messages to show the new one
      const updatedMessages = await getMessagesByDate(formattedDate);
      setMessages(updatedMessages);

      // Simulate AI response after a short delay
      if (isAiEnabled) {
        setTimeout(async () => {
          const aiResponse = "That's interesting! Tell me more about that.";
          await addMessage(aiResponse, true, "text", formattedDate);

          // Refresh messages again to show AI response
          const finalMessages = await getMessagesByDate(formattedDate);
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
