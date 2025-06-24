import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Settings2Icon,
  MailIcon,
  LogOutIcon,
  UserIcon,
} from "lucide-react-native";
import { useAuth } from "@/lib/auth/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

  // Extract first name from full name
  const firstName = displayName.split(" ")[0];
  const userEmail = user?.email || "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <TouchableOpacity onPress={onPress} className="p-2">
          <Settings2Icon size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="border"
        style={{
          backgroundColor: colors.surface.button,
          borderColor: colors.border.light,
        }}
      >
        {/* User Name */}
        <DropdownMenuItem className="p-3">
          <View className="flex-row items-center">
            <UserIcon size={16} color={colors.text.secondary} />
            <Text
              className="ml-3 text-base font-semibold"
              style={{ color: colors.text.secondary }}
            >
              {firstName}
            </Text>
          </View>
        </DropdownMenuItem>

        {/* User Email */}
        <DropdownMenuItem className="p-3">
          <View className="flex-row items-center">
            <MailIcon size={16} color={colors.text.secondary} />
            <Text
              className="ml-3 text-base"
              style={{ color: colors.text.secondary }}
            >
              {userEmail}
            </Text>
          </View>
        </DropdownMenuItem>

        <DropdownMenuSeparator
          style={{ backgroundColor: colors.border.light }}
        />

        {/* Sign Out */}
        <DropdownMenuItem onPress={handleSignOut} className="p-3">
          <View className="flex-row items-center">
            <LogOutIcon size={16} color={colors.text.destructive} />
            <Text
              className="ml-3 text-base"
              style={{ color: colors.text.destructive }}
            >
              Sign Out
            </Text>
          </View>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
