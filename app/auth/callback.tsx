import { useEffect } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/lib/supabase/client";
import { useTheme } from "@/contexts/ThemeContext";

export default function AuthCallback() {
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the current session after OAuth callback
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          router.replace("/");
          return;
        }

        if (data.session) {
          console.log("Successfully authenticated:", data.session.user);
          router.replace("/(home)");
        } else {
          console.log("No session found, redirecting to home");
          router.replace("/");
        }
      } catch (error) {
        console.error("Unexpected error during auth callback:", error);
        router.replace("/");
      }
    };

    // Small delay to ensure the auth state is properly set
    const timer = setTimeout(handleAuthCallback, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View
      className="flex-1 justify-center items-center"
      style={{ backgroundColor: colors.background }}
    >
      <ActivityIndicator size="large" color={colors.text.primary} />
      <Text className="mt-4 text-lg" style={{ color: colors.text.primary }}>
        Completing sign in...
      </Text>
    </View>
  );
}
