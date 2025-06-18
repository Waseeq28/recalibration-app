import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "expo-router";
import { CalendarIcon } from "lucide-react-native";
import { useGoogleAuth } from "@/lib/hooks/useGoogleAuth";

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { signInWithGoogle, isLoading } = useGoogleAuth();

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
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
    <View
      className="flex-1 justify-center items-center p-4"
      style={{ backgroundColor: colors.background }}
    >
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

        <Link href="/calendar-screen" asChild>
          <TouchableOpacity
            className="flex-row items-center justify-center mb-4 py-4 rounded-xl"
            style={{ backgroundColor: colors.surface.button }}
          >
            <CalendarIcon size={20} color={colors.text.secondary} />
            <Text
              className="ml-2 text-base font-medium"
              style={{ color: colors.text.secondary }}
            >
              Calendar View
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
