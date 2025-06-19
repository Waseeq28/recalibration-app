import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "expo-router";
import { CalendarIcon } from "lucide-react-native";
import AuthSection from "@/lib/auth/components/AuthSection";
import { useAuth } from "@/lib/auth/context/AuthContext";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Authentication Section */}
      <AuthSection />

      {/* Navigation Section */}
      {user && (
        <View style={styles.navigationContainer}>
          <Link href="/calendar-screen" asChild>
            <TouchableOpacity
              style={[
                styles.calendarButton,
                { backgroundColor: colors.surface.button },
              ]}
            >
              <CalendarIcon size={20} color={colors.text.secondary} />
              <Text
                style={[
                  styles.calendarButtonText,
                  { color: colors.text.secondary },
                ]}
              >
                Calendar View
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  navigationContainer: {
    width: "100%",
    maxWidth: 320,
    position: "absolute",
    bottom: 32,
    alignSelf: "center",
  },
  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingVertical: 16,
    borderRadius: 12,
  },
  calendarButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
  },
});
