import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { User, LogOut } from "lucide-react-native";
import { useAuth } from "@/lib/auth/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileProps {
  onPress?: () => void;
}

export default function Profile({ onPress }: ProfileProps) {
  const { colors } = useTheme();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const displayName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || "User";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TouchableOpacity onPress={onPress} style={{ padding: 8 }}>
          <User size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onPress={handleSignOut}>
          <LogOut size={16} color={colors.text.destructive} />
          <Text style={{ color: colors.text.destructive, marginLeft: 8 }}>
            Sign Out
          </Text>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
