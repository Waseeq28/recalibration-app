import React from "react";
import { View, FlatList, Text } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import MessageCard from "./message-card";
import { Message } from "@/lib/db/schemas/message.schema";

type MessageListingProps = {
  messages: Message[];
};

export default function MessageListing({ messages }: MessageListingProps) {
  const { colors } = useTheme();

  if (messages.length === 0) {
    return (
      <View
        style={{ backgroundColor: colors.background }}
        className="flex-1 justify-center items-center p-6"
      >
        <Text
          style={{ color: colors.text.secondary }}
          className="text-xl text-center"
        >
          No messages yet. Start a conversation!
        </Text>
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: colors.background }} className="flex-1">
      <FlatList
        data={messages}
        renderItem={({ item }) => <MessageCard {...item} />}
        keyExtractor={(item) => item.id}
        className="w-full px-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 8 }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}
