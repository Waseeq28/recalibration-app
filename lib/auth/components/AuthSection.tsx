import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Linking,
} from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { LinearGradient } from "expo-linear-gradient";

export default function AuthSection() {
  const { colors } = useTheme();
  const { user, signOut, isLoading: authLoading } = useAuth();
  const { signInWithGoogle, isLoading } = useGoogleAuth();

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.text.primary} />
        <Text style={[styles.loadingText, { color: colors.text.primary }]}>
          Loading...
        </Text>
      </View>
    );
  }

  const displayName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "User";

  return (
    <View style={styles.container}>
      {/* Welcome Section */}
      {user ? (
        <View style={styles.content}>
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeTitle, { color: colors.text.primary }]}>
              Welcome {displayName}!
            </Text>
            <Text style={[styles.emailText, { color: colors.text.secondary }]}>
              Email: {user.email}
            </Text>
          </View>
          <View style={styles.buttonOuterContainer}>
            <TouchableOpacity
              onPress={signOut}
              style={[
                styles.button,
                { backgroundColor: colors.text.destructive },
              ]}
            >
              <Text style={styles.signOutButtonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.topSection}>
            <View style={styles.welcomeContainer}>
              <Text
                style={[
                  styles.welcomeTitle,
                  styles.textCenter,
                  { color: colors.text.primary },
                ]}
              >
                Welcome to{" "}
                <Text style={{ color: colors.text.accent }}>
                  Recalibration App
                </Text>
              </Text>
              {/* <Text
                style={[
                  styles.subheading,
                  styles.textCenter,
                  { color: colors.text.secondary },
                ]}
              >
                Recognize and Reframe your thoughts
              </Text> */}
              <Text
                style={[
                  styles.frameworkText,
                  styles.textCenter,
                  { color: colors.text.primary },
                ]}
              >
                Based on the Self Recalibration Framework
              </Text>
            </View>
          </View>

          <View style={styles.middleSection}>
            <LinearGradient
              colors={colors.gradients.card.outer}
              style={styles.signInCardGradient}
            >
              <LinearGradient
                colors={colors.gradients.card.inner}
                style={styles.signInCard}
              >
                <Text
                  style={[styles.signInTitle, { color: colors.text.accent }]}
                >
                  Sign in to reframe your thoughts
                </Text>
                <TouchableOpacity
                  onPress={signInWithGoogle}
                  disabled={isLoading}
                  style={[styles.button, { backgroundColor: "white" }]}
                >
                  {isLoading ? (
                    <ActivityIndicator color="black" size="small" />
                  ) : (
                    // Icon placeholder
                    <Text style={[styles.buttonText, { color: "black" }]}>
                      Continue with Google
                    </Text>
                  )}
                </TouchableOpacity>
              </LinearGradient>
            </LinearGradient>
          </View>
          <View style={styles.bottomSection}>
            <View style={styles.footer}>
              <Text
                style={[styles.footerText, { color: colors.text.secondary }]}
              >
                By continuing, you agree to our{" "}
                <Text
                  style={[styles.linkText, { color: colors.text.primary }]}
                  onPress={() => Linking.openURL("#")}
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  style={[styles.linkText, { color: colors.text.primary }]}
                  onPress={() => Linking.openURL("#")}
                >
                  Privacy Policy
                </Text>
              </Text>
            </View>
          </View>
        </>
      )}
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
    width: "100%",
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  topSection: {
    flex: 2,
    justifyContent: "center",
    width: "100%",
  },
  middleSection: {
    flex: 3,
    justifyContent: "center",
    width: "100%",
    alignItems: "center",
  },
  bottomSection: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    paddingBottom: 16,
  },
  welcomeContainer: {
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 34,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  emailText: {
    fontSize: 18,
    marginBottom: 32,
  },
  subheading: {
    fontSize: 18,
    maxWidth: 340,
    textAlign: "center",
    marginBottom: 8,
  },
  frameworkText: {
    fontSize: 20,
    // maxWidth: 300,
    textAlign: "center",
    fontWeight: "500",
    marginTop: 50,
  },
  textCenter: {
    textAlign: "center",
  },
  buttonOuterContainer: {
    width: "100%",
    maxWidth: 340,
  },
  signInCardGradient: {
    borderRadius: 20,
    padding: 1,
    width: "100%",
    maxWidth: 340,
  },
  signInCard: {
    width: "100%",
    padding: 24,
    borderRadius: 19,
    alignItems: "center",
  },
  signInTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  signInSubtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 16,
  },
  signOutButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
  footer: {
    maxWidth: 340,
    alignSelf: "center",
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
  },
  linkText: {
    textDecorationLine: "underline",
  },
});
