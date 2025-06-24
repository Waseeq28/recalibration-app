import React from "react";
import { View, Text } from "react-native";

interface IntensityIndicatorProps {
  level: number;
}

export default function IntensityIndicator({ level }: IntensityIndicatorProps) {
  const getIntensityColor = (level: number) => {
    if (level <= 3) return "#22c55e"; // Green
    if (level <= 6) return "#f59e0b"; // Yellow
    return "#ef4444"; // Red
  };

  const getIntensityLabel = (level: number) => {
    if (level <= 3) return "Mild";
    if (level <= 6) return "Moderate";
    return "High";
  };

  return (
    <View className="flex-row items-center">
      <View className="flex-1 flex-row items-center mr-3">
        <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${(level / 10) * 100}%`,
              backgroundColor: getIntensityColor(level),
            }}
          />
        </View>
      </View>
      <View
        className="px-3 py-1 rounded-full"
        style={{ backgroundColor: getIntensityColor(level) }}
      >
        <Text className="text-sm font-semibold text-white">
          {getIntensityLabel(level)}
        </Text>
      </View>
    </View>
  );
}
