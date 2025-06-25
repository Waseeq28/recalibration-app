import React, { useState, useEffect, useMemo } from "react";
import { View, TextInput, ScrollView, Text, SafeAreaView } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import MessageInput from "./components/message-input";
import MessageListing from "./components/message-listing";
import {
  Message as DbMessage,
  useSupabaseMessages,
} from "@/lib/database/hooks/useMessages";
import { useChat, Message } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import { generateAPIUrl } from "@/lib/utils";

interface AiChatTabProps {
  selectedDate: string;
}

export default function AiChatTab({ selectedDate }: AiChatTabProps) {
  const { colors } = useTheme();
  const { addMessage, getMessagesByDate, isLoading } = useSupabaseMessages();
  const [dbMessages, setDbMessages] = useState<DbMessage[]>([]);

  const messageDate = new Date(selectedDate);

  const initialMessages = useMemo(() => {
    const mappedMessages = dbMessages.map(
      (msg) =>
        ({
          id: msg.id,
          content: msg.content,
          role: msg.isAiGenerated ? "assistant" : "user",
          createdAt: new Date(msg.createdAt),
        } as Message)
    );

    // Debug: Check for duplicate IDs
    const ids = mappedMessages.map((m) => m.id);
    const uniqueIds = new Set(ids);
    if (ids.length !== uniqueIds.size) {
      console.warn("Duplicate message IDs detected:", ids);
    }

    return mappedMessages;
  }, [dbMessages]);

  const {
    messages,
    append,
    isLoading: isAiThinking,
    setMessages: setAiMessages,
  } = useChat({
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    api: generateAPIUrl("/api/chat"),
    initialMessages: initialMessages,
    onFinish: async (message) => {
      await addMessage(message.content, true, "text", messageDate);
      const finalMessages = await getMessagesByDate(selectedDate);
      setDbMessages(finalMessages);
    },
    onError: async (error: Error) => {
      console.error("❌ Error from AI service:", error);
      const errorMessage = `Sorry, I'm having trouble right now: ${error.message}`;
      await addMessage(errorMessage, true, "text", messageDate);
      const finalMessages = await getMessagesByDate(selectedDate);
      setDbMessages(finalMessages);
    },
  });

  useEffect(() => {
    setAiMessages(initialMessages);
  }, [initialMessages, setAiMessages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!isLoading) {
        const dateMessages = await getMessagesByDate(selectedDate);
        setDbMessages(dateMessages);
      }
    };
    fetchMessages();
  }, [getMessagesByDate, selectedDate, isLoading]);

  const handleSendMessage = async (content: string, isAiEnabled: boolean) => {
    const newDbMessageId = await addMessage(
      content,
      false,
      "text",
      messageDate
    );
    if (newDbMessageId) {
      const updatedMessages = await getMessagesByDate(selectedDate);
      setDbMessages(updatedMessages);
      if (isAiEnabled) {
        append({
          id: newDbMessageId,
          role: "user",
          content: content,
        });
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
        <MessageInput
          onSendMessage={handleSendMessage}
          isAiThinking={isAiThinking}
        />
      </View>
    </View>
  );
}
