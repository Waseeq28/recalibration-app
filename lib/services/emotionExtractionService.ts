import { Message } from '@ai-sdk/react';

export interface ExtractionPrompts {
  themeSummary: string;
  primaryEmotion: string;
  emotionalIntensity: string;
  selfCompassion: string;
  keyChallenge: string;
  actionPlan: string;
  dailyWin: string;
}

export class EmotionExtractionService {
  
  static generateConversationContext(messages: Message[]): string {
    return messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'AI'}: ${msg.content}`)
      .join('\n\n');
  }

  static getExtractionPrompts(): ExtractionPrompts {
    return {
      themeSummary: `
TASK: Extract the main themes and patterns from this conversation.

INSTRUCTIONS:
- Identify 1-2 dominant themes that emerge from what the user actually discussed
- Focus ONLY on topics the user brought up, not what the AI suggested
- Write in first person past tense ("I discussed..." format) to reflect on the completed conversation
- If no clear themes emerge, state "I didn't identify any dominant themes in my conversation"
- Maximum 2 sentences

CONVERSATION:
{conversation}

EXTRACT: Main themes/patterns using past tense "I discussed..." format (summarized concisely, 1-2 sentences max)`,

      primaryEmotion: `
TASK: Extract the dominant emotion expressed by the user.

INSTRUCTIONS:
- Identify the primary emotion the user explicitly expressed or strongly implied
- Write in first person past tense ("I felt..." format) to reflect on the completed conversation
- If multiple emotions, choose the most prominent one
- Format as compound emotion if appropriate (e.g., "Frustrated Determination", "Anxious Excitement")
- If no clear emotion expressed, state "I didn't express any clear emotions"
- ONLY extract, do NOT suggest or infer beyond what was communicated

CONVERSATION:
{conversation}

EXTRACT: The dominant emotion using past tense "I felt..." format (1-3 words max)`,

      emotionalIntensity: `
TASK: Extract emotional intensity level and any manifestations mentioned.

INSTRUCTIONS:
- Rate intensity 1-10 based on the strength of emotions expressed in the conversation
- For manifestations: Include physical, mental, or behavioral signs the user described
- Write manifestations in first person past tense ("I experienced..." format) to reflect on the completed conversation
- If user didn't mention any manifestations, state "I didn't mention any manifestations"
- Base intensity on actual language used, not assumptions

CONVERSATION:
{conversation}

EXTRACT: 
- Intensity level (1-10): [number]
- Manifestations: [summarize using past tense "I experienced..." format, or "I didn't mention any manifestations"]`,

      selfCompassion: `
TASK: Extract evidence of self-compassion or self-criticism from the conversation.

INSTRUCTIONS:
- Look for instances where user showed kindness or harshness toward themselves
- Write in first person past tense ("I was..." or "I treated myself..." format) to reflect on the completed conversation
- Include both positive self-compassion AND self-criticism if present
- If no evidence of either, state "I didn't discuss how I treated myself"
- Do NOT suggest what they should do - only extract what they actually demonstrated

CONVERSATION:
{conversation}

EXTRACT: Evidence of self-compassion or self-criticism using past tense "I was..." format`,

      keyChallenge: `
TASK: Extract the main challenge or difficulty the user discussed.

INSTRUCTIONS:
- Identify the primary problem, obstacle, or difficulty the user specifically mentioned
- Write in first person past tense ("I struggled with..." format) to reflect on the completed conversation
- If multiple challenges, choose the one they spent most time discussing
- If no specific challenge mentioned, state "I didn't discuss any specific challenges"
- Do NOT interpret or expand beyond what they actually shared

CONVERSATION:
{conversation}

EXTRACT: The main challenge/difficulty using past tense "I struggled with..." format`,

      actionPlan: `
TASK: Extract specific actions, plans, or commitments the user mentioned.

INSTRUCTIONS:
- Look for concrete steps, plans, or commitments the user specifically mentioned
- Write in first person using appropriate tense ("I planned to..." for past decisions, "I want to..." for future intentions)
- Include both actions they've already decided to take AND actions they're considering
- If no specific actions mentioned, state "I didn't mention any specific plans"
- Do NOT suggest actions - only extract what they actually mentioned planning to do

CONVERSATION:
{conversation}

EXTRACT: Specific actions, plans, or commitments using appropriate past/future tense format`,

      dailyWin: `
TASK: Extract positive achievements, accomplishments, or wins the user mentioned.

INSTRUCTIONS:
- Look for things that went well, accomplishments, or positive moments the user shared
- Write in first person past tense ("I accomplished..." or "I was proud that..." format) to reflect on completed achievements
- Include both big and small wins they mentioned
- If no positive experiences mentioned, state "I didn't mention any specific wins today"
- Only extract what they actually shared as positive, not what you think they should celebrate

CONVERSATION:
{conversation}

EXTRACT: Positive achievements, wins, or accomplishments using past tense "I accomplished..." format`,


    };
  }

  static createExtractionPrompt(parameterPrompt: string, conversation: string): string {
    return parameterPrompt.replace('{conversation}', conversation);
  }

  static validateExtractionResponse(response: string, parameter: string): string {
    // Clean up the response
    const cleaned = response.trim();
    
    // If response is too short or generic, return a default
    if (cleaned.length < 10) {
      return `No clear ${parameter} information extracted from conversation`;
    }
    
    return cleaned;
  }
} 