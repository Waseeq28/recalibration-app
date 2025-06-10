import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  BellIcon,
  MessageCircleIcon,
  HeartIcon,
  ArrowLeftIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "lucide-react-native";
import { WeekCalendar, CalendarProvider } from "react-native-calendars";
import { format } from "date-fns";
import { router } from "expo-router";

type TabType = "ai-chat" | "emotional-profile";

export default function CalendarViewScreen() {
  const { colors } = useTheme();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState(
    format(new Date(), "MMMM yyyy")
  );
  const [activeTab, setActiveTab] = useState<TabType>("ai-chat");
  const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    // Update month based on selected date
    const selectedMonth = format(new Date(day.dateString), "MMMM yyyy");
    setCurrentMonth(selectedMonth);
  };

  const handleVisibleMonthsChange = (months: any[]) => {
    // Update month based on first visible month (more reliable for WeekCalendar)
    if (months && months.length > 0) {
      const firstMonth = months[0];
      const monthDate = new Date(firstMonth.year, firstMonth.month - 1);
      setCurrentMonth(format(monthDate, "MMMM"));
    }
  };

  const toggleCalendar = () => {
    setIsCalendarCollapsed(!isCalendarCollapsed);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Month Header with Chevron */}
      <TouchableOpacity
        className="px-4 pt-3 pb-3"
        onPress={toggleCalendar}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text
              className="text-center text-base font-medium"
              style={{ color: colors.text.primary }}
            >
              {isCalendarCollapsed
                ? format(new Date(selectedDate), "EEEE, MMMM d")
                : currentMonth}
            </Text>
          </View>
          <TouchableOpacity
            className="p-2 ml-3"
            onPress={toggleCalendar}
            activeOpacity={0.7}
          >
            {isCalendarCollapsed ? (
              <ChevronDownIcon size={20} color={colors.text.primary} />
            ) : (
              <ChevronUpIcon size={20} color={colors.text.primary} />
            )}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Week Calendar with Provider - Conditionally Rendered */}
      {!isCalendarCollapsed && (
        <CalendarProvider date={selectedDate} style={{ flex: 0 }}>
          <WeekCalendar
            onDayPress={handleDayPress}
            onVisibleMonthsChange={handleVisibleMonthsChange}
            firstDay={1}
            enableSwipeMonths={true}
            theme={{
              backgroundColor: colors.background,
              calendarBackground: colors.background,
              textSectionTitleColor: colors.text.secondary,
              selectedDayBackgroundColor: colors.text.primary,
              selectedDayTextColor: colors.background,
              todayTextColor: colors.text.primary,
              todayBackgroundColor: colors.text.accent,
              dayTextColor: colors.text.primary,
              textDisabledColor: colors.text.secondary,
              monthTextColor: colors.text.primary,
            }}
          />
        </CalendarProvider>
      )}

      {/* Content Area with Tabs */}
      <View className="flex-1">
        <View
          className="flex-1 rounded-t-2xl"
          style={{ backgroundColor: colors.surface.secondary }}
        >
          {/* Tab Bar */}
          <View className="flex-row p-2">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center py-4 px-3 mx-1"
              style={{
                borderBottomWidth: activeTab === "ai-chat" ? 2 : 0,
                borderBottomColor:
                  activeTab === "ai-chat" ? colors.text.accent : "transparent",
              }}
              onPress={() => setActiveTab("ai-chat")}
              activeOpacity={0.7}
            >
              <Text
                className="text-sm font-medium"
                style={{
                  color:
                    activeTab === "ai-chat"
                      ? colors.text.primary
                      : colors.text.secondary,
                }}
              >
                AI Chat
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center py-4 px-3 mx-1"
              style={{
                borderBottomWidth: activeTab === "emotional-profile" ? 2 : 0,
                borderBottomColor:
                  activeTab === "emotional-profile"
                    ? colors.text.accent
                    : "transparent",
              }}
              onPress={() => setActiveTab("emotional-profile")}
              activeOpacity={0.7}
            >
              <Text
                className="text-sm font-medium"
                style={{
                  color:
                    activeTab === "emotional-profile"
                      ? colors.text.primary
                      : colors.text.secondary,
                }}
              >
                Emotional Profile
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          <View className="flex-1 p-4">
            {activeTab === "ai-chat" ? (
              <View className="flex-1 justify-center items-center">
                <MessageCircleIcon size={40} color={colors.text.secondary} />
                <Text
                  className="text-base mt-4 text-center"
                  style={{ color: colors.text.secondary }}
                >
                  Reflect on your day and get personalized insights
                </Text>
              </View>
            ) : (
              <View className="flex-1 justify-center items-center">
                <HeartIcon size={40} color={colors.text.secondary} />
                <Text
                  className="text-base mt-4 text-center"
                  style={{ color: colors.text.secondary }}
                >
                  Track and understand your emotional journey
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
