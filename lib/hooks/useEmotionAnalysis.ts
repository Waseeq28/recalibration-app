import { useState, useCallback, useEffect } from 'react';
import { fetch as expoFetch } from 'expo/fetch';
import { generateAPIUrl } from '@/lib/utils';
import { EmotionProfileData } from '@/lib/services/emotionAnalysisService';
import { Message } from '@ai-sdk/react';
import { EmotionAnalysisService } from '@/lib/services/emotionAnalysisService';

interface UseEmotionAnalysisReturn {
  emotionProfile: EmotionProfileData | null;
  isAnalyzing: boolean;
  error: string | null;
  analyzeEmotions: (messages: Message[]) => Promise<void>;
  clearAnalysis: () => void;
}

// In-memory cache for emotion analyses
const analysisCache = new Map<string, {
  data: EmotionProfileData;
  timestamp: number;
}>();

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes
const MIN_MESSAGES_FOR_ANALYSIS = 2; // Need at least 2 messages (user + AI response)

export function useEmotionAnalysis(): UseEmotionAnalysisReturn {
  const [emotionProfile, setEmotionProfile] = useState<EmotionProfileData | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCacheKey = useCallback((messages: Message[]): string => {
    // Create a cache key based on message content and length
    const messageContent = messages
      .map(m => `${m.role}:${m.content.substring(0, 50)}`)
      .join('|');
    return btoa(messageContent).substring(0, 20); // Base64 encode and truncate
  }, []);

  const analyzeEmotions = useCallback(async (messages: Message[]) => {
    if (!messages || messages.length < MIN_MESSAGES_FOR_ANALYSIS) {
      const suggestions = EmotionAnalysisService.generateConversationSuggestions(messages);
      const suggestionText = suggestions.length > 0 ? ` ${suggestions[0]}` : '';
      setError(`Insufficient conversation data for meaningful analysis.${suggestionText}`);
      setEmotionProfile(null);
      return;
    }

    // Use the service to check if we have sufficient content
    if (!EmotionAnalysisService.hasSufficientContent(messages)) {
      const suggestions = EmotionAnalysisService.generateConversationSuggestions(messages);
      const suggestionText = suggestions.length > 0 ? ` ${suggestions[0]}` : '';
      setError(`Conversation needs more depth for analysis.${suggestionText}`);
      setEmotionProfile(null);
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Prepare messages using the service
      const preparedMessages = EmotionAnalysisService.prepareMessagesForAnalysis(messages);
      
      // Check cache first
      const cacheKey = generateCacheKey(preparedMessages);
      const cached = analysisCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        setEmotionProfile(cached.data);
        setIsAnalyzing(false);
        return;
      }

      // Convert to API format (only user and assistant messages)
      const messagesToAnalyze = preparedMessages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }));

      const response = await expoFetch(generateAPIUrl('/api/emotion-analysis'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messagesToAnalyze
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Emotion analysis API error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData.error
        });
        throw new Error(errorData.error || `Analysis failed: ${response.status} - ${response.statusText}`);
      }

      const rawResult = await response.json();
      
      // Validate the response using the service
      const analysisResult = EmotionAnalysisService.validateEmotionProfile(rawResult);
      
      if (!analysisResult) {
        throw new Error('Received invalid analysis data from AI service');
      }

      // Cache the result
      analysisCache.set(cacheKey, {
        data: analysisResult,
        timestamp: Date.now()
      });

      setEmotionProfile(analysisResult);
    } catch (err) {
      console.error('Emotion analysis error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to analyze emotions';
      setError(errorMessage);
      setEmotionProfile(null);
    } finally {
      setIsAnalyzing(false);
    }
  }, [generateCacheKey]);

  const clearAnalysis = useCallback(() => {
    setEmotionProfile(null);
    setError(null);
    setIsAnalyzing(false);
  }, []);

  // Clean up expired cache entries periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      for (const [key, value] of analysisCache.entries()) {
        if (now - value.timestamp > CACHE_DURATION) {
          analysisCache.delete(key);
        }
      }
    }, CACHE_DURATION);

    return () => clearInterval(cleanup);
  }, []);

  return {
    emotionProfile,
    isAnalyzing,
    error,
    analyzeEmotions,
    clearAnalysis,
  };
} 