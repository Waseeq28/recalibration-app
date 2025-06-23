import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ children, fallback }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text.primary} />
        <Text style={[styles.loadingText, { color: colors.text.primary }]}>
          Checking authentication...
        </Text>
      </View>
    );
  }

  // If user is not authenticated, redirect immediately
  if (!user) {
    useEffect(() => {
      router.replace("/(home)");
    }, []);

    if (fallback) {
      return <>{fallback}</>;
    }

    return null; // Don't render anything while redirecting
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
  },
});
