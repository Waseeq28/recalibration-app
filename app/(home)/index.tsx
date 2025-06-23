import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { Link, router } from "expo-router";
import { CalendarIcon } from "lucide-react-native";
import AuthSection from "@/lib/auth/components/AuthSection";
import { useAuth } from "@/lib/auth/context/AuthContext";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();

  // Redirect authenticated users directly to calendar screen
  useEffect(() => {
    if (user) {
      router.replace("/calendar-screen");
    }
  }, [user]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Authentication Section - only shown for unauthenticated users */}
      <AuthSection />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
});
