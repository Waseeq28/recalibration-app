import { useCallback, useState } from "react";
import { supabase } from "../client";
import { nanoid } from "nanoid";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth/context/AuthContext";

// Message types
export type MessageType = "text";

export interface Message {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string; // ISO timestamp string from database
  date: string; // ISO date string from database
  isAiGenerated: boolean;
  createdAt: string; // ISO timestamp string from database
  user_id: string; // User ID who created the message
}

const formatTimestamp = (date: Date): string => {
  return format(date, "h:mm a");
};

const formatDate = (date: Date): string => {
  return format(date, "MMM d, yyyy");
};

export function useSupabaseMessages() {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addMessage = useCallback(
    async (
      content: string,
      isAiGenerated: boolean = false,
      type: MessageType = "text",
      customDate?: Date
    ): Promise<string | null> => {
      try {
        setIsLoading(true);

        const now = new Date();
        // Ensure we have a valid Date object
        const messageDate = (customDate && customDate instanceof Date) ? customDate : now;

        if (!user) {
          console.error("User not authenticated");
          return null;
        }

        const newMessage = {
          id: nanoid(),
          type,
          content,
          timestamp: now.toISOString(), // Store as ISO timestamp
          date: messageDate.toISOString().split('T')[0], // Store as YYYY-MM-DD
          isAiGenerated,
          createdAt: now.toISOString(), // Store as ISO timestamp
          user_id: user.id, // Add user ID to the message
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
    [user]
  );

  const getMessageById = useCallback(
    async (id: string): Promise<Message | null> => {
      try {
        if (!user) {
          console.error("User not authenticated");
          return null;
        }

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
    [user]
  );

  const getMessagesByDate = useCallback(
    async (date: string): Promise<Message[]> => {
      try {
        if (!user) {
          console.error("User not authenticated");
          return [];
        }

        // Expect date in YYYY-MM-DD format
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
    [user]
  );

  const getAllMessages = useCallback(async (): Promise<Message[]> => {
    try {
      if (!user) {
        console.error("User not authenticated");
        return [];
      }

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
  }, [user]);

  const deleteMessage = useCallback(async (id: string): Promise<boolean> => {
    try {
      if (!user) {
        console.error("User not authenticated");
        return false;
      }

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
  }, [user]);

  // Helper functions to format database timestamps/dates for display
  const formatMessageTimestamp = useCallback((timestamp: string): string => {
    return formatTimestamp(new Date(timestamp));
  }, []);

  const formatMessageDate = useCallback((date: string): string => {
    return formatDate(new Date(date));
  }, []);

  return {
    isLoading,
    addMessage,
    getMessageById,
    getMessagesByDate,
    getAllMessages,
    deleteMessage,
    formatMessageTimestamp,
    formatMessageDate,
  };
}
