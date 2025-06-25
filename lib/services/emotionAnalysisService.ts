import { Message } from '@ai-sdk/react';

export interface EmotionProfileData {
  themeSummary: string;
  primaryEmotion: string;
  emotionalIntensity: {
    level: number;
    physicalManifestation: string;
  };
  selfCompassion: string;
  keyChallenge: string;
  actionPlan: string;
  dailyWin: string;
}

export interface AnalysisContext {
  date: string;
  messageCount: number;
  averageMessageLength: number;
  timeSpan: string;
  hasMultipleExchanges: boolean;
}

export class EmotionAnalysisService {
  private static readonly MIN_CONTENT_LENGTH = 50; // Minimum total content for meaningful analysis
  private static readonly MAX_MESSAGES_FOR_ANALYSIS = 50; // Limit to prevent token overuse

  /**
   * Prepare messages for analysis by filtering and optimizing content
   */
  static prepareMessagesForAnalysis(messages: Message[]): Message[] {
    // Filter out very short messages that don't provide meaningful content
    const meaningfulMessages = messages.filter(msg => 
      msg.content && msg.content.trim().length > 5
    );

    // Limit the number of messages to prevent token overuse
    const recentMessages = meaningfulMessages.slice(-this.MAX_MESSAGES_FOR_ANALYSIS);

    return recentMessages;
  }

  /**
   * Generate analysis context to provide better insights
   */
  static generateAnalysisContext(messages: Message[]): AnalysisContext {
    const totalContent = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    const averageLength = messages.length > 0 ? totalContent / messages.length : 0;
    
    // Calculate time span
    const timestamps = messages
      .map(msg => msg.createdAt)
      .filter(date => date instanceof Date)
      .sort((a, b) => a.getTime() - b.getTime());
    
    const timeSpan = timestamps.length > 1 
      ? this.calculateTimeSpan(timestamps[0], timestamps[timestamps.length - 1])
      : 'Single session';

    // Determine if there are multiple exchanges (user-AI pairs)
    const exchanges = this.countExchanges(messages);

    return {
      date: new Date().toISOString().split('T')[0],
      messageCount: messages.length,
      averageMessageLength: Math.round(averageLength),
      timeSpan,
      hasMultipleExchanges: exchanges > 1
    };
  }

  /**
   * Check if messages contain sufficient content for analysis
   */
  static hasSufficientContent(messages: Message[]): boolean {
    const totalContent = messages.reduce((sum, msg) => sum + msg.content.length, 0);
    const userMessages = messages.filter(msg => msg.role === 'user');
    
    return (
      totalContent >= this.MIN_CONTENT_LENGTH &&
      userMessages.length >= 1 &&
      messages.length >= 2
    );
  }

  /**
   * Generate helpful suggestions for improving conversation depth
   */
  static generateConversationSuggestions(messages: Message[]): string[] {
    const suggestions: string[] = [];
    const userMessages = messages.filter(msg => msg.role === 'user');
    const avgUserMessageLength = userMessages.reduce((sum, msg) => sum + msg.content.length, 0) / userMessages.length;

    if (avgUserMessageLength < 30) {
      suggestions.push("Try sharing more details about your thoughts and feelings");
    }

    if (userMessages.length < 3) {
      suggestions.push("Continue the conversation to generate richer insights");
    }

    const hasEmotionWords = messages.some(msg => 
      /\b(feel|felt|emotion|happy|sad|angry|anxious|excited|worried|proud|grateful)\b/i.test(msg.content)
    );

    if (!hasEmotionWords) {
      suggestions.push("Describe how you're feeling to get more accurate emotional insights");
    }

    return suggestions;
  }

  /**
   * Validate and clean emotion profile data
   */
  static validateEmotionProfile(data: any): EmotionProfileData | null {
    try {
      // Check required fields
      const requiredFields = [
        'themeSummary', 'primaryEmotion', 'emotionalIntensity', 
        'selfCompassion', 'keyChallenge', 
        'actionPlan', 'dailyWin'
      ];

      for (const field of requiredFields) {
        if (!data[field]) {
          console.warn(`Missing required field: ${field}`);
          return null;
        }
      }

      // Validate emotional intensity
      if (!data.emotionalIntensity.level || 
          data.emotionalIntensity.level < 1 || 
          data.emotionalIntensity.level > 10) {
        console.warn('Invalid emotional intensity level');
        return null;
      }



      return data as EmotionProfileData;
    } catch (error) {
      console.error('Error validating emotion profile:', error);
      return null;
    }
  }

  private static calculateTimeSpan(start: Date, end: Date): string {
    const diffMs = end.getTime() - start.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} minutes`;
    } else if (diffMins < 24 * 60) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffMins / (24 * 60));
      return `${days} day${days > 1 ? 's' : ''}`;
    }
  }

  private static countExchanges(messages: Message[]): number {
    let exchanges = 0;
    let expectingAI = false;

    for (const message of messages) {
      if (message.role === 'user' && !expectingAI) {
        expectingAI = true;
      } else if (message.role === 'assistant' && expectingAI) {
        exchanges++;
        expectingAI = false;
      }
    }

    return exchanges;
  }
} 