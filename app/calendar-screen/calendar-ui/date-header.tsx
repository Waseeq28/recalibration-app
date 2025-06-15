import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { ChevronUpIcon, ChevronDownIcon } from "lucide-react-native";
import { format } from "date-fns";

interface DateHeaderProps {
  selectedDate: string;
  currentMonth: string;
  isCalendarCollapsed: boolean;
  onToggleCalendar: () => void;
}

export default function DateHeader({
  selectedDate,
  currentMonth,
  isCalendarCollapsed,
  onToggleCalendar,
}: DateHeaderProps) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      className="px-4 pt-3 pb-3"
      onPress={onToggleCalendar}
      activeOpacity={0.7}
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
  );
}
