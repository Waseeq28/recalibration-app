import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  RefreshCwIcon,
  AlertCircleIcon,
  MessageCircleIcon,
  PlayIcon,
} from "lucide-react-native";
import ParameterSections from "./components/parameter-sections";
import AnalysisStatus from "./components/analysis-status";
import { useEmotionAnalysis } from "@/lib/hooks/useEmotionAnalysis";
import { useSupabaseMessages } from "@/lib/database/hooks/useMessages";
import { Message } from "@ai-sdk/react";

interface EmotionProfileTabProps {
  selectedDate: string;
}

export default function EmotionProfileTab({
  selectedDate,
}: EmotionProfileTabProps) {
  const { colors } = useTheme();
  const { getMessagesByDate } = useSupabaseMessages();
  const { emotionProfile, isAnalyzing, error, analyzeEmotions, clearAnalysis } =
    useEmotionAnalysis();
  const [messages, setMessages] = useState<Message[]>([]);

  // Load messages for the selected date
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const dateMessages = await getMessagesByDate(selectedDate);

        // Convert database messages to AI SDK format
        const aiMessages: Message[] = dateMessages.map((msg) => ({
          id: msg.id,
          content: msg.content,
          role: msg.isAiGenerated ? "assistant" : "user",
          createdAt: new Date(msg.createdAt),
        }));

        setMessages(aiMessages);

        // Remove auto-analysis - now manual only
      } catch (error) {
        console.error("Error loading messages for emotion analysis:", error);
      }
    };

    loadMessages();
  }, [
    selectedDate,
    getMessagesByDate,
    emotionProfile,
    isAnalyzing,
    analyzeEmotions,
  ]);

  // Clear analysis when date changes
  useEffect(() => {
    clearAnalysis();
  }, [selectedDate, clearAnalysis]);

  const handleRefreshAnalysis = () => {
    if (messages.length >= 2) {
      analyzeEmotions(messages);
    }
  };

  // Show loading state
  if (isAnalyzing) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{
          backgroundColor: colors.background,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <ActivityIndicator size="large" color={colors.text.primary} />
        <Text
          className="text-lg font-medium mt-4 text-center"
          style={{ color: colors.text.primary }}
        >
          Analyzing Your Emotions...
        </Text>
        <Text
          className="text-sm mt-2 text-center px-6"
          style={{ color: colors.text.secondary }}
        >
          Processing your conversation to create personalized insights
        </Text>
      </View>
    );
  }

  // Show error state
  if (error) {
    return (
      <View
        className="flex-1 justify-center items-center px-6"
        style={{
          backgroundColor: colors.background,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <View className="items-center">
          <AlertCircleIcon size={48} color={colors.text.secondary} />
          <Text
            className="text-lg font-medium mt-4 text-center"
            style={{ color: colors.text.primary }}
          >
            Analysis Unavailable
          </Text>
          <Text
            className="text-sm mt-2 text-center leading-6"
            style={{ color: colors.text.secondary }}
          >
            {error}
          </Text>
          {messages.length >= 2 && (
            <TouchableOpacity
              onPress={handleRefreshAnalysis}
              className="flex-row items-center mt-6 px-4 py-2 rounded-lg"
              style={{ backgroundColor: colors.surface.button }}
            >
              <RefreshCwIcon size={16} color={colors.text.primary} />
              <Text
                className="ml-2 font-medium"
                style={{ color: colors.text.primary }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Show empty state when no sufficient messages
  if (messages.length < 2) {
    return (
      <View
        className="flex-1 justify-center items-center px-6"
        style={{
          backgroundColor: colors.background,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <View className="items-center">
          <MessageCircleIcon size={48} color={colors.text.secondary} />
          <Text
            className="text-lg font-medium mt-4 text-center"
            style={{ color: colors.text.primary }}
          >
            Start a Conversation
          </Text>
          <Text
            className="text-sm mt-2 text-center leading-6"
            style={{ color: colors.text.secondary }}
          >
            Chat with AI about your day to generate personalized emotional
            insights and reflections.
          </Text>
        </View>
      </View>
    );
  }

  // Only show analysis if we have real AI-generated data
  if (!emotionProfile) {
    return (
      <View
        className="flex-1 justify-center items-center px-6"
        style={{
          backgroundColor: colors.background,
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
        }}
      >
        <AnalysisStatus
          isAnalyzing={isAnalyzing}
          hasAnalysis={false}
          error={error}
        />
        <View className="items-center mt-4">
          <MessageCircleIcon size={48} color={colors.text.secondary} />
          <Text
            className="text-lg font-medium mt-4 text-center"
            style={{ color: colors.text.primary }}
          >
            {error ? "Analysis Failed" : "Ready to Analyze"}
          </Text>
          <Text
            className="text-sm mt-2 text-center leading-6"
            style={{ color: colors.text.secondary }}
          >
            {error
              ? "There was an issue generating your emotional insights. Try again or have a longer conversation."
              : messages.length >= 2
              ? "Your conversation is ready for emotional analysis. Tap the button below to generate insights."
              : "Chat with AI about your day, then return here to generate personalized emotional insights."}
          </Text>

          {/* Show analyze button when sufficient messages and no error, or retry button on error */}
          {messages.length >= 2 && (
            <TouchableOpacity
              onPress={handleRefreshAnalysis}
              className="flex-row items-center mt-6 px-6 py-3 rounded-lg"
              style={{
                backgroundColor: error ? colors.surface.button : "#3b82f6",
              }}
            >
              {error ? (
                <>
                  <RefreshCwIcon size={18} color={colors.text.primary} />
                  <Text
                    className="ml-2 font-medium"
                    style={{ color: colors.text.primary }}
                  >
                    Try Again
                  </Text>
                </>
              ) : (
                <>
                  <PlayIcon size={18} color="white" />
                  <Text className="ml-2 font-medium text-white">
                    Analyze Conversation
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

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
        {/* Analysis Status */}
        <AnalysisStatus
          isAnalyzing={isAnalyzing}
          hasAnalysis={!!emotionProfile}
          error={error}
        />

        {/* Manual test button for regenerating analysis */}
        <TouchableOpacity
          onPress={handleRefreshAnalysis}
          className="flex-row items-center justify-center mb-4 py-3 px-6 rounded-lg"
          style={{ backgroundColor: "#3b82f6" }}
        >
          <RefreshCwIcon size={18} color="white" />
          <Text className="ml-2 font-medium text-white">
            🧪 Test New Analysis
          </Text>
        </TouchableOpacity>

        {/* Show ONLY real AI-generated insights */}
        <ParameterSections data={emotionProfile} />

        {/* Show timestamp of analysis */}
        <View
          className="mt-4 p-3 rounded-lg"
          style={{ backgroundColor: colors.surface.secondary }}
        >
          <Text
            className="text-xs text-center"
            style={{ color: colors.text.secondary }}
          >
            ✨ AI-powered insights from your conversation
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
