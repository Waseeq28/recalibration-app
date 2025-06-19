import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
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
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color={colors.text.primary} />
        <Text className="mt-4 text-lg" style={{ color: colors.text.primary }}>
          Checking authentication...
        </Text>
      </View>
    );
  }

  // If user is not authenticated, show fallback or redirect
  if (!user) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <View
        className="flex-1 justify-center items-center p-4"
        style={{ backgroundColor: colors.background }}
      >
        <Text
          className="text-xl font-bold mb-8 text-center"
          style={{ color: colors.text.primary }}
        >
          Please sign in to access this feature
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(home)")}
          className="py-4 px-6 rounded-xl"
          style={{ backgroundColor: colors.surface.button }}
        >
          <Text
            className="text-base font-medium"
            style={{ color: colors.text.secondary }}
          >
            Go to Sign In
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}
