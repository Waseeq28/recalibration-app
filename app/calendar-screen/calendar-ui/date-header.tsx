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
    <View className="px-4 py-3 flex-row items-center justify-between">
      {/* Left: Profile */}
      <View>
        {!isCalendarCollapsed && <Profile onPress={onProfilePress} />}
      </View>

      {/* Center: Date */}
      <TouchableOpacity onPress={onToggleCalendar}>
        <Text
          className="text-center text-base font-medium px-20"
          style={{ color: colors.text.primary }}
        >
          {isCalendarCollapsed
            ? format(new Date(selectedDate), "EEEE, MMMM d")
            : currentMonth}
        </Text>
      </TouchableOpacity>

      {/* Right: Chevron */}
      <View>
        <TouchableOpacity onPress={onToggleCalendar} className="p-2">
          {isCalendarCollapsed ? (
            <ChevronDownIcon size={20} color={colors.text.primary} />
          ) : (
            <ChevronUpIcon size={20} color={colors.text.primary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
