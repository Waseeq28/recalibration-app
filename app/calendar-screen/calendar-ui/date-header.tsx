import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react-native";
import { format } from "date-fns";
import Profile from "./profile";

interface DateHeaderProps {
  selectedDate: string;
  currentMonth: string;
  isCalendarCollapsed: boolean;
  onToggleCalendar: () => void;
  onProfilePress?: () => void;
}

export default function DateHeader({
  selectedDate,
  currentMonth,
  isCalendarCollapsed,
  onToggleCalendar,
  onProfilePress,
}: DateHeaderProps) {
  const { colors } = useTheme();

  return (
    <View className="px-4 pt-3 pb-3 flex-row items-center justify-between">
      {!isCalendarCollapsed && <Profile onPress={onProfilePress} />}

      <TouchableOpacity
        onPress={onToggleCalendar}
        activeOpacity={0.7}
        className="flex-1"
      >
        <View className="relative flex-row items-center justify-center">
          <Text
            className="text-center text-base font-medium"
            style={{ color: colors.text.primary }}
          >
            {isCalendarCollapsed
              ? format(new Date(selectedDate), "EEEE, MMMM d")
              : currentMonth}
          </Text>
          <View className="absolute right-0">
            {isCalendarCollapsed ? (
              <ChevronDownIcon size={20} color={colors.text.primary} />
            ) : (
              <ChevronUpIcon size={20} color={colors.text.primary} />
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View className="w-8" />
    </View>
  );
}
