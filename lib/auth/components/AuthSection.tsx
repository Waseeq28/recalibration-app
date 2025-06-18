import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useGoogleAuth } from "../hooks/useGoogleAuth";

interface AuthSectionProps {
  className?: string;
}

export default function AuthSection({ className }: AuthSectionProps) {
  const { colors } = useTheme();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { signInWithGoogle, isLoading } = useGoogleAuth();

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <View className={`items-center ${className}`}>
        <ActivityIndicator size="large" color={colors.text.primary} />
        <Text className="mt-4 text-lg" style={{ color: colors.text.primary }}>
          Loading...
        </Text>
      </View>
    );
  }

  const displayName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "User";

  return (
    <View className={`items-center ${className}`}>
      {/* Welcome Section */}
      {user ? (
        <View className="items-center mb-8">
          <Text
            className="text-2xl font-bold mb-2"
            style={{ color: colors.text.primary }}
          >
            Welcome {displayName}!
          </Text>
          <Text className="text-base" style={{ color: colors.text.secondary }}>
            Email: {user.email}
          </Text>
        </View>
      ) : (
        <Text
          className="text-2xl font-bold mb-8"
          style={{ color: colors.text.primary }}
        >
          Welcome!
        </Text>
      )}

      {/* Auth Action Button */}
      <View className="w-full max-w-xs">
        {user ? (
          <TouchableOpacity
            onPress={signOut}
            className="flex-row items-center justify-center mb-4 py-4 px-6 rounded-xl"
            style={{ backgroundColor: colors.text.destructive }}
          >
            <Text className="text-white font-medium text-base">Sign Out</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={signInWithGoogle}
            disabled={isLoading}
            className="flex-row items-center justify-center mb-4 py-4 px-6 rounded-xl"
            style={{ backgroundColor: colors.text.accent }}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white font-medium text-base">
                Sign in with Google
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
