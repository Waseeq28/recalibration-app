import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
  Platform,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { MaterialIcons, AntDesign } from "@expo/vector-icons";

export default function AuthSection() {
  const { colors } = useTheme();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { signInWithGoogle, isLoading } = useGoogleAuth();

  if (authLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.text.primary} />
        <Text style={[styles.loadingText, { color: colors.text.primary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  // If user is authenticated, don't show anything (they will be redirected)
  if (user) {
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Container */}
      <View style={styles.topContainer}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.surface.button,
              borderColor: colors.text.secondary,
            },
          ]}
        >
          <Text style={[styles.badgeText, { color: colors.text.secondary }]}>
            Alpha Version
          </Text>
        </View>
        <Text style={[styles.title, { color: colors.text.accent }]}>
          The Recalibration App
        </Text>
        <Text style={[styles.subtitle, { color: colors.text.secondary }]}>
          Connect With Your Emotions
        </Text>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.googleButton,
            {
              backgroundColor: colors.surface.button,
              borderColor: colors.border.light,
            },
          ]}
          onPress={signInWithGoogle}
          disabled={isLoading}
          activeOpacity={0.85}
        >
          {isLoading ? (
            <ActivityIndicator color={colors.text.primary} size="small" />
          ) : (
            <View style={styles.googleButtonContent}>
              <AntDesign
                name="google"
                size={22}
                color="#EA4335"
                style={{ marginRight: 8 }}
              />
              <Text
                style={[
                  styles.googleButtonText,
                  { color: colors.text.primary },
                ]}
              >
                Continue with Google
              </Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={18}
                color={colors.text.secondary}
                style={{ marginLeft: 8 }}
              />
            </View>
          )}
        </TouchableOpacity>
        <Text style={[styles.terms, { color: colors.text.secondary }]}>
          By continuing, you agree to our{" "}
          <Text
            style={[styles.link, { color: colors.text.primary }]}
            onPress={() => Linking.openURL("#")}
          >
            Terms of Service
          </Text>{" "}
          and{" "}
          <Text
            style={[styles.link, { color: colors.text.primary }]}
            onPress={() => Linking.openURL("#")}
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingText: {
    marginTop: 16,
    fontSize: 18,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 125,
    paddingHorizontal: 18,
    backgroundColor: "transparent",
  },
  topContainer: {
    width: "100%",
    alignItems: "center",
  },
  middleContainer: {
    width: "100%",
    alignItems: "center",
  },
  cardBg: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 11,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  bottomContainer: {
    width: "100%",
    alignItems: "center",
  },
  badge: {
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 18,
    marginTop: 10,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 32,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  cardDesc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 480,
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 18,
    borderWidth: 1,
    marginTop: 2,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleButtonText: {
    fontWeight: "600",
    fontSize: 17,
  },
  terms: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 18,
    marginTop: 2,
    paddingHorizontal: 8,
  },
  link: {
    textDecorationLine: "underline",
  },
});
