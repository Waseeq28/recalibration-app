import React, { useState } from "react";
import { View, SafeAreaView } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { format } from "date-fns";
import DateHeader from "./calendar-ui/date-header";
import WeekCalendarComponent from "./calendar-ui/week-calendar";
import TabBar from "./daily-review/tab-bar";
import AiChatTab from "./daily-review/ai-chat/ai-chat-tab";
import EmotionProfileTab from "./daily-review/emotion-profile/emotion-profile-tab";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View>
        <DateHeader
          selectedDate={selectedDate}
          currentMonth={currentMonth}
          isCalendarCollapsed={isCalendarCollapsed}
          onToggleCalendar={toggleCalendar}
        />
      </View>
      {/* Week Calendar - Conditionally Rendered */}
      {!isCalendarCollapsed && (
        <View>
          <WeekCalendarComponent
            selectedDate={selectedDate}
            onDayPress={handleDayPress}
            onVisibleMonthsChange={handleVisibleMonthsChange}
          />
        </View>
      )}

      {/* Content Area with Tabs */}
      <View
        style={{
          flex: 1,
          backgroundColor: colors.surface.secondary,
          borderWidth: 1,
          borderColor: colors.border.light,
          borderRadius: 16,
        }}
      >
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        {activeTab === "ai-chat" ? <AiChatTab /> : <EmotionProfileTab />}
      </View>
    </SafeAreaView>
  );
}
