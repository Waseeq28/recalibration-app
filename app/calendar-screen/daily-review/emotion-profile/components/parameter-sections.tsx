import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  HeartIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  HighlighterIcon,
  HandHeartIcon,
  RocketIcon,
} from "lucide-react-native";
import ParameterCard from "./parameter-card";
import IntensityIndicator from "./intensity-indicator";
import { EmotionProfileData } from "@/lib/services/emotionAnalysisService";

interface ParameterSectionsProps {
  data: EmotionProfileData;
}

export default function ParameterSections({ data }: ParameterSectionsProps) {
  const { colors } = useTheme();

  return (
    <>
      {/* Today's Theme */}
      <ParameterCard
        icon={
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "#3b82f6" }}
          >
            <HighlighterIcon size={18} color="#ffffff" />
          </View>
        }
        title="Today's Highlights"
      >
        <Text
          style={{ color: colors.text.primary }}
          className="text-base leading-6"
        >
          {data.themeSummary}
        </Text>
      </ParameterCard>

      {/* Primary Emotion */}
      <ParameterCard
        icon={
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "#ec4899" }}
          >
            <HeartIcon size={18} color="#ffffff" />
          </View>
        }
        title="Primary Emotion"
      >
        <Text
          className="text-xl font-bold mb-3"
          style={{ color: colors.text.primary }}
        >
          {data.primaryEmotion}
        </Text>
        <View className="mb-3">
          <Text
            className="text-sm mb-2 font-medium"
            style={{ color: colors.text.secondary }}
          >
            Intensity Level
          </Text>
          <IntensityIndicator level={data.emotionalIntensity.level} />
        </View>
        <Text
          className="text-sm leading-5"
          style={{ color: colors.text.secondary }}
        >
          Manifestation: {data.emotionalIntensity.physicalManifestation}
        </Text>
      </ParameterCard>

      {/* Self-Compassion */}
      <ParameterCard
        icon={
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "#10b981" }}
          >
            <HandHeartIcon size={18} color="#ffffff" />
          </View>
        }
        title="Self-Compassion"
      >
        <Text
          style={{ color: colors.text.primary }}
          className="text-base leading-6"
        >
          {data.selfCompassion}
        </Text>
      </ParameterCard>

      {/* Key Challenge */}
      <ParameterCard
        icon={
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "#ef4444" }}
          >
            <AlertTriangleIcon size={18} color="#ffffff" />
          </View>
        }
        title="Key Challenge"
      >
        <Text
          style={{ color: colors.text.primary }}
          className="text-base leading-6"
        >
          {data.keyChallenge}
        </Text>
      </ParameterCard>

      {/* Action Plan */}
      <ParameterCard
        icon={
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "#22c55e" }}
          >
            <CheckCircleIcon size={18} color="#ffffff" />
          </View>
        }
        title="Action Plan"
      >
        <Text
          style={{ color: colors.text.primary }}
          className="text-base leading-6"
        >
          {data.actionPlan}
        </Text>
      </ParameterCard>

      {/* Daily Win */}
      <ParameterCard
        icon={
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "#f59e0b" }}
          >
            <RocketIcon size={18} color="#ffffff" />
          </View>
        }
        title="Daily Win"
      >
        <Text
          style={{ color: colors.text.primary }}
          className="text-base leading-6"
        >
          {data.dailyWin}
        </Text>
      </ParameterCard>
    </>
  );
}
