import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Link, Stack } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: "Oops! Not Found" }} />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.title, { color: colors.text.primary }]}>
          This screen doesn't exist.
        </Text>

        <Link href="/" style={[styles.link, { color: colors.text.accent }]}>
          <Text style={[styles.linkText, { color: colors.text.accent }]}>
            Go to home screen!
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingTop: 15,
  },
  linkText: {
    fontSize: 14,
  },
});
