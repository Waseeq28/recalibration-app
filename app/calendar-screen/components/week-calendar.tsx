import React from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { WeekCalendar, CalendarProvider } from "react-native-calendars";

interface WeekCalendarComponentProps {
  selectedDate: string;
  onDayPress: (day: any) => void;
  onVisibleMonthsChange: (months: any[]) => void;
}

export default function WeekCalendarComponent({
  selectedDate,
  onDayPress,
  onVisibleMonthsChange,
}: WeekCalendarComponentProps) {
  const { colors } = useTheme();

  return (
    <CalendarProvider date={selectedDate} style={{ flex: 0 }}>
      <WeekCalendar
        onDayPress={onDayPress}
        onVisibleMonthsChange={onVisibleMonthsChange}
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
  );
}
