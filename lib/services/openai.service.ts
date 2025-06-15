// OpenAI Service - Handles all AI API communication via Supabase Edge Functions

// Types for OpenAI API responses
export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: ChatMessage;
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class OpenAIService {
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor() {
    // Get Supabase credentials from environment variables
    this.supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
    this.supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.warn("Supabase credentials not configured properly");
    }
  }

  /**
   * Send a message to OpenAI via Supabase Edge Function
   */
  async sendMessage(
    messages: ChatMessage[],
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
    } = {}
  ): Promise<string> {
    // Check if Supabase credentials are available
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      throw new Error("Please add your Supabase credentials to the .env file");
    }

    // Convert the messages array to a simple query string for the basic Edge Function
    const query = messages
      .filter(msg => msg.role === "user")
      .map(msg => msg.content)
      .join(" ");

    if (!query.trim()) {
      throw new Error("No user message found in the conversation");
    }

    try {
      // Make the HTTP request to Supabase Edge Function
      const response = await fetch(`${this.supabaseUrl}/functions/v1/openai`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${this.supabaseAnonKey}`,
        },
        body: JSON.stringify({
          query: query,
        }),
      });

      // Check if the request was successful
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Supabase Edge Function Error:", errorText);

        // Handle specific error types
        if (response.status === 401) {
          throw new Error("Invalid Supabase credentials. Please check your keys.");
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        } else {
          throw new Error(
            `Edge Function error: ${errorText || "Unknown error"}`
          );
        }
      }

      // The Edge Function returns plain text, not JSON
      const aiResponse = await response.text();

      return aiResponse || "I apologize, but I could not generate a response.";
    } catch (error) {
      console.error("Error calling Edge Function:", error);

      // Re-throw the error so the UI can handle it
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Failed to connect to AI service. Please check your internet connection."
        );
      }
    }
  }

  /**
   * Simple helper method for single user messages
   */
  async getAIResponse(
    userMessage: string,
    systemPrompt?: string
  ): Promise<string> {
    const messages: ChatMessage[] = [];

    // Add system prompt if provided
    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    // Add the user's message
    messages.push({
      role: "user",
      content: userMessage,
    });

    return this.sendMessage(messages);
  }
}

// Export singleton instance
export const openAIService = new OpenAIService();
