import React, { useState } from "react";
import { View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";
import DateHeader from "./components/date-header";
import WeekCalendarComponent from "./components/week-calendar";
import TabBar from "./components/tab-bar";
import AiChatTab from "./components/ai-chat-tab";
import EmotionProfileTab from "./components/emotion-profile-tab";

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
      <DateHeader
        selectedDate={selectedDate}
        currentMonth={currentMonth}
        isCalendarCollapsed={isCalendarCollapsed}
        onToggleCalendar={toggleCalendar}
      />

      {/* Week Calendar - Conditionally Rendered */}
      {!isCalendarCollapsed && (
        <WeekCalendarComponent
          selectedDate={selectedDate}
          onDayPress={handleDayPress}
          onVisibleMonthsChange={handleVisibleMonthsChange}
        />
      )}

      {/* Content Area with Tabs */}
      <View
        className="flex-1 rounded-t-2xl"
        style={{ backgroundColor: colors.surface.secondary }}
      >
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "ai-chat" ? <AiChatTab /> : <EmotionProfileTab />}
      </View>
    </View>
  );
}
