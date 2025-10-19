import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { EmotionExtractionService } from "@/lib/services/emotionExtractionService";

interface ExtractionResult {
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

async function extractParameter(
  parameterName: string,
  prompt: string,
): Promise<string> {
  try {
    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
      temperature: 0.2,
      maxTokens: 150,
    });

    const response = EmotionExtractionService.validateExtractionResponse(
      result.text,
      parameterName,
    );
    return response;
  } catch (error) {
    console.error(`Error extracting ${parameterName}:`, error);
    return `Unable to extract ${parameterName} from conversation`;
  }
}

function parseEmotionalIntensity(
  intensityText: string,
): { level: number; physicalManifestation: string } {
  const levelMatch = intensityText.match(/(?:level|intensity).*?(\d{1,2})/i);
  const level = levelMatch
    ? Math.min(Math.max(parseInt(levelMatch[1]), 1), 10)
    : 5;

  const manifestationMatch = intensityText.match(
    /manifestations?[^:]*:(.*)$/is,
  );
  const physicalManifestation = manifestationMatch
    ? manifestationMatch[1].trim()
    : "No manifestations mentioned";

  return { level, physicalManifestation };
}

export async function POST(req: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not configured");
      return Response.json(
        { error: "AI service not configured" },
        { status: 500 },
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "No messages provided for analysis" },
        { status: 400 },
      );
    }

    const conversationText = EmotionExtractionService
      .generateConversationContext(messages);
    const prompts = EmotionExtractionService.getExtractionPrompts();

    const extractions = await Promise.allSettled([
      extractParameter(
        "themeSummary",
        EmotionExtractionService.createExtractionPrompt(
          prompts.themeSummary,
          conversationText,
        ),
      ),
      extractParameter(
        "primaryEmotion",
        EmotionExtractionService.createExtractionPrompt(
          prompts.primaryEmotion,
          conversationText,
        ),
      ),
      extractParameter(
        "emotionalIntensity",
        EmotionExtractionService.createExtractionPrompt(
          prompts.emotionalIntensity,
          conversationText,
        ),
      ),
      extractParameter(
        "selfCompassion",
        EmotionExtractionService.createExtractionPrompt(
          prompts.selfCompassion,
          conversationText,
        ),
      ),
      extractParameter(
        "keyChallenge",
        EmotionExtractionService.createExtractionPrompt(
          prompts.keyChallenge,
          conversationText,
        ),
      ),
      extractParameter(
        "actionPlan",
        EmotionExtractionService.createExtractionPrompt(
          prompts.actionPlan,
          conversationText,
        ),
      ),
      extractParameter(
        "dailyWin",
        EmotionExtractionService.createExtractionPrompt(
          prompts.dailyWin,
          conversationText,
        ),
      ),
    ]);

    const results = extractions.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      } else {
        console.error(`Extraction ${index} failed:`, result.reason);
        return `Extraction failed for this parameter`;
      }
    });

    const emotionProfile: ExtractionResult = {
      themeSummary: results[0],
      primaryEmotion: results[1],
      emotionalIntensity: parseEmotionalIntensity(results[2]),
      selfCompassion: results[3],
      keyChallenge: results[4],
      actionPlan: results[5],
      dailyWin: results[6],
    };

    return Response.json(emotionProfile);
  } catch (error) {
    console.error("Emotion analysis error:", error);
    return Response.json(
      { error: "Failed to analyze emotions" },
      { status: 500 },
    );
  }
}
