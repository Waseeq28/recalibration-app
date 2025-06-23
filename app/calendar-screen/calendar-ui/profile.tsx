import React from "react";
import { TouchableWithoutFeedback } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { User } from "lucide-react-native";

interface ProfileProps {
  onPress?: () => void;
}

export default function Profile({ onPress }: ProfileProps) {
  const { colors } = useTheme();

  return (
    <TouchableWithoutFeedback onPress={onPress} className="p-2">
      <User size={20} color={colors.text.primary} />
    </TouchableWithoutFeedback>
  );
}
