// OpenAI Service - Handles all AI API communication

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
  private apiKey: string;
  private baseURL = "https://api.openai.com/v1";

  constructor() {
    // Get API key from environment variables
    this.apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY || "";

    if (!this.apiKey || this.apiKey === "your-api-key-here") {
      console.warn("OpenAI API key not configured properly");
    }
  }

  /**
   * Send a message to OpenAI and get a response
   */
  async sendMessage(
    messages: ChatMessage[],
    options: {
      model?: string;
      maxTokens?: number;
      temperature?: number;
    } = {}
  ): Promise<string> {
    const {
      model = "gpt-3.5-turbo",
      maxTokens = 150,
      temperature = 0.7,
    } = options;

    // Check if API key is available
    if (!this.apiKey || this.apiKey === "your-api-key-here") {
      throw new Error("Please add your OpenAI API key to the .env file");
    }

    try {
      // Make the HTTP request to OpenAI
      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          max_tokens: maxTokens,
          temperature,
        }),
      });

      // Check if the request was successful
      if (!response.ok) {
        const errorData = await response.json();
        console.error("OpenAI API Error:", errorData);

        // Handle specific error types
        if (response.status === 401) {
          throw new Error("Invalid API key. Please check your OpenAI API key.");
        } else if (response.status === 429) {
          throw new Error("Rate limit exceeded. Please try again later.");
        } else if (
          response.status === 400 &&
          errorData.error?.code === "insufficient_quota"
        ) {
          throw new Error("OpenAI quota exceeded. Please check your billing.");
        } else {
          throw new Error(
            `OpenAI API error: ${errorData.error?.message || "Unknown error"}`
          );
        }
      }

      // Parse the successful response
      const data: OpenAIResponse = await response.json();

      // Return the AI's message
      return (
        data.choices[0]?.message?.content ||
        "I apologize, but I could not generate a response."
      );
    } catch (error) {
      console.error("Error calling OpenAI:", error);

      // Re-throw the error so the UI can handle it
      if (error instanceof Error) {
        throw error;
      } else {
        throw new Error(
          "Failed to connect to OpenAI. Please check your internet connection."
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
