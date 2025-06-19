import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import MessageInput from "./components/message-input";
import MessageListing from "./components/message-listing";
import { Message, useSupabaseMessages } from "@/lib/database/hooks/useMessages";
import { format } from "date-fns";
import { openAIService } from "@/lib/openai/openai.service";

interface AiChatTabProps {
  selectedDate: string;
}

export default function AiChatTab({ selectedDate }: AiChatTabProps) {
  const { colors } = useTheme();
  const { addMessage, getMessagesByDate, isLoading } = useSupabaseMessages();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // selectedDate is already in YYYY-MM-DD format, which matches what the database expects
  const messageDate = new Date(selectedDate);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!isLoading) {
        const dateMessages = await getMessagesByDate(selectedDate);
        setMessages(dateMessages);
      }
    };

    fetchMessages();
  }, [getMessagesByDate, selectedDate, isLoading]);

  const handleSendMessage = async (content: string, isAiEnabled: boolean) => {
    // Add user message to database with selected date
    const messageId = await addMessage(content, false, "text", messageDate);

    if (messageId) {
      // Refresh messages to show the new one
      const updatedMessages = await getMessagesByDate(selectedDate);
      setMessages(updatedMessages);

      // Get real AI response using OpenAI
      if (isAiEnabled) {
        try {
          // Show loading state
          setIsAiThinking(true);

          // Create a system prompt to give the AI context and personality
          const systemPrompt = `You are a helpful personal assistant for a daily reflection app. 
          The user is reflecting on their day (${selectedDate}). 
          Be supportive, encouraging, and help them process their thoughts and experiences. 
          Ask thoughtful follow-up questions when appropriate.
          Keep responses concise but meaningful (1-3 sentences).`;

          // Call our OpenAI service to get a real AI response
          const aiResponse = await openAIService.getAIResponse(
            content,
            systemPrompt
          );

          // Save AI response to database
          await addMessage(aiResponse, true, "text", messageDate);

          // Refresh messages to show AI response
          const finalMessages = await getMessagesByDate(selectedDate);
          setMessages(finalMessages);
        } catch (error) {
          console.error("❌ Error getting AI response:", error);

          // Show user-friendly error message
          const errorMessage =
            error instanceof Error
              ? `Sorry, I'm having trouble right now: ${error.message}`
              : "I'm sorry, I'm having trouble connecting right now. Please try again later.";

          await addMessage(errorMessage, true, "text", messageDate);

          // Refresh messages to show error message
          const finalMessages = await getMessagesByDate(selectedDate);
          setMessages(finalMessages);
        } finally {
          // Hide loading state in both success and error cases
          setIsAiThinking(false);
        }
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
