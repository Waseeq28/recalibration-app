import { useCallback, useState } from "react";
import { supabase } from "../supabase";
import { nanoid } from "nanoid";
import { format } from "date-fns";

// Types (same as your RxDB schema)
export type MessageType = "text";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
  date: string;
  isAiGenerated: boolean;
  createdAt: number;
}

const formatTimestamp = (date: Date): string => {
  return format(date, "h:mm a");
};

const formatDate = (date: Date): string => {
  return format(date, "MMM d, yyyy");
};

export function useSupabaseMessages() {
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = useCallback(
    async (
      content: string,
      isAiGenerated: boolean = false,
      type: MessageType = "text",
      customDate?: string
    ): Promise<string | null> => {
      try {
        setIsLoading(true);

        const now = new Date();
        const date = customDate || formatDate(now);
        const timestamp = formatTimestamp(now);
        const createdAt = now.getTime();

        const newMessage: Message = {
          id: nanoid(),
          type,
          content,
          timestamp,
          date,
          isAiGenerated,
          createdAt,
        };

        const { error } = await supabase.from("messages").insert(newMessage);

        if (error) {
          console.error("Error adding message:", error);
          return null;
        }

        return newMessage.id;
      } catch (error) {
        console.error("Error adding message:", error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getMessageById = useCallback(
    async (id: string): Promise<Message | null> => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error getting message:", error);
          return null;
        }

        return data;
      } catch (error) {
        console.error("Error getting message:", error);
        return null;
      }
    },
    []
  );

  const getMessagesByDate = useCallback(
    async (date: string): Promise<Message[]> => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("date", date)
          .order("createdAt", { ascending: true });

        if (error) {
          console.error("Error getting messages by date:", error);
          return [];
        }

        return data || [];
      } catch (error) {
        console.error("Error getting messages by date:", error);
        return [];
      }
    },
    []
  );

  const getAllMessages = useCallback(async (): Promise<Message[]> => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("createdAt", { ascending: true });

      if (error) {
        console.error("Error getting all messages:", error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error("Error getting all messages:", error);
      return [];
    }
  }, []);

  const deleteMessage = useCallback(async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from("messages").delete().eq("id", id);

      if (error) {
        console.error("Error deleting message:", error);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting message:", error);
      return false;
    }
  }, []);

  return {
    isLoading,
    addMessage,
    getMessageById,
    getMessagesByDate,
    getAllMessages,
    deleteMessage,
  };
}
