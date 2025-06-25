import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  BrainIcon,
  CheckCircleIcon,
  AlertCircleIcon,
} from "lucide-react-native";

interface AnalysisStatusProps {
  isAnalyzing: boolean;
  hasAnalysis: boolean;
  error?: string | null;
}

export default function AnalysisStatus({
  isAnalyzing,
  hasAnalysis,
  error,
}: AnalysisStatusProps) {
  const { colors } = useTheme();

  if (error) {
    return (
      <View
        className="flex-row items-center px-3 py-2 mb-2 rounded-lg"
        style={{ backgroundColor: colors.surface.secondary }}
      >
        <AlertCircleIcon size={14} color="#ef4444" />
        <Text className="ml-2 text-xs" style={{ color: colors.text.secondary }}>
          Analysis unavailable
        </Text>
      </View>
    );
  }

  if (isAnalyzing) {
    return (
      <View
        className="flex-row items-center px-3 py-2 mb-2 rounded-lg"
        style={{ backgroundColor: colors.surface.secondary }}
      >
        <ActivityIndicator size="small" color={colors.text.secondary} />
        <Text className="ml-2 text-xs" style={{ color: colors.text.secondary }}>
          Analyzing conversation...
        </Text>
      </View>
    );
  }

  if (hasAnalysis) {
    return (
      <View
        className="flex-row items-center px-3 py-2 mb-2 rounded-lg"
        style={{ backgroundColor: "#10b98120" }}
      >
        <CheckCircleIcon size={14} color="#10b981" />
        <Text className="ml-2 text-xs" style={{ color: "#10b981" }}>
          AI-powered insights generated
        </Text>
      </View>
    );
  }

  return null;
}
