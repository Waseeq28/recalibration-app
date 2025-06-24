export interface EmotionProfileData {
  themeSummary: string;
  primaryEmotion: string;
  emotionalIntensity: {
    level: number;
    physicalManifestation: string;
  };
  selfCompassion: string;
  keyChallenge: string;
  mainFocus: string;
  actionPlan: string;
  dailyWin: string;
  threeBuckets: {
    growth: string;
    maintenance: string;
    joy: string;
  };
}

// Sample data for demonstration and development
export const sampleEmotionProfile: EmotionProfileData = {
  themeSummary:
    "Balancing work pressure with personal boundaries while maintaining optimism for upcoming opportunities.",
  primaryEmotion: "Determined Anxiety",
  emotionalIntensity: {
    level: 7,
    physicalManifestation: "Tension in shoulders, restless energy",
  },
  selfCompassion:
    "Acknowledged the difficulty of the situation without harsh self-judgment. Reminded myself that feeling overwhelmed is normal when facing multiple deadlines.",
  keyChallenge:
    "Managing overwhelming workload while a key team member was out sick, leading to increased responsibility and time pressure.",
  mainFocus:
    "Completing the project proposal deadline while maintaining quality standards and not burning out.",
  actionPlan:
    "Break the proposal into 3 smaller chunks, delegate 2 research tasks to junior team members, and set stop at 7 PM for work.",
  dailyWin:
    "Successfully reorganized my task priorities and said no to a non-essential meeting to protect my focus time.",
  threeBuckets: {
    growth:
      "Learned new project management technique and practiced delegation skills",
    maintenance:
      "Completed 30-minute morning workout and prepared healthy lunch",
    joy: "Had a genuine laugh with colleague during coffee break and listened to favorite playlist",
  },
}; 