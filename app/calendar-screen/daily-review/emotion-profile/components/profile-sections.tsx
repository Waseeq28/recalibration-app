import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  MessageCircleIcon,
  HeartIcon,
  AlertTriangleIcon,
  TargetIcon,
  CheckCircleIcon,
  StarIcon,
  ActivityIcon,
  HighlighterIcon,
  HandHeartIcon,
  RocketIcon,
} from "lucide-react-native";
import ProfileCard from "./profile-card";
import IntensityIndicator from "./intensity-indicator";
import { EmotionProfileData } from "../data/sample-data";

interface ProfileSectionsProps {
  data: EmotionProfileData;
}

export default function ProfileSections({ data }: ProfileSectionsProps) {
  const { colors } = useTheme();

  return (
    <>
      {/* Today's Theme */}
      <ProfileCard
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
      </ProfileCard>

      {/* Primary Emotion */}
      <ProfileCard
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
          Physical: {data.emotionalIntensity.physicalManifestation}
        </Text>
      </ProfileCard>

      {/* Self-Compassion */}
      <ProfileCard
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
      </ProfileCard>

      {/* Key Challenge */}
      <ProfileCard
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
      </ProfileCard>

      {/* Main Focus */}
      <ProfileCard
        icon={
          <View
            className="w-9 h-9 rounded-full items-center justify-center"
            style={{ backgroundColor: "#3b82f6" }}
          >
            <TargetIcon size={18} color="#ffffff" />
          </View>
        }
        title="Main Focus"
      >
        <Text
          style={{ color: colors.text.primary }}
          className="text-base leading-6"
        >
          {data.mainFocus}
        </Text>
      </ProfileCard>

      {/* Action Plan */}
      <ProfileCard
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
      </ProfileCard>

      {/* Daily Win */}
      <ProfileCard
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
      </ProfileCard>

      {/* Daily Balance */}
      <View className="mb-6">
        <ProfileCard
          icon={
            <View
              className="w-9 h-9 rounded-full items-center justify-center"
              style={{ backgroundColor: "#8b5cf6" }}
            >
              <ActivityIcon size={18} color="#ffffff" />
            </View>
          }
          title="Daily Balance"
        >
          <View className="gap-2">
            <View>
              <View className="flex-row items-center mb-2">
                <View
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: "#22c55e" }}
                />
                <Text
                  className="text-base font-semibold"
                  style={{ color: "#22c55e" }}
                >
                  Growth
                </Text>
              </View>
              <Text
                className="text-base leading-6 ml-7"
                style={{ color: colors.text.primary }}
              >
                {data.threeBuckets.growth}
              </Text>
            </View>

            <View>
              <View className="flex-row items-center mb-2">
                <View
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: "#3b82f6" }}
                />
                <Text
                  className="text-base font-semibold"
                  style={{ color: "#3b82f6" }}
                >
                  Maintenance
                </Text>
              </View>
              <Text
                className="text-base leading-6 ml-7"
                style={{ color: colors.text.primary }}
              >
                {data.threeBuckets.maintenance}
              </Text>
            </View>

            <View>
              <View className="flex-row items-center mb-2">
                <View
                  className="w-4 h-4 rounded-full mr-3"
                  style={{ backgroundColor: "#f59e0b" }}
                />
                <Text
                  className="text-base font-semibold"
                  style={{ color: "#f59e0b" }}
                >
                  Joy
                </Text>
              </View>
              <Text
                className="text-base leading-6 ml-7"
                style={{ color: colors.text.primary }}
              >
                {data.threeBuckets.joy}
              </Text>
            </View>
          </View>
        </ProfileCard>
      </View>
    </>
  );
}
