import { useCallback, useState } from "react";
import { useRxDb } from "../RxDbProvider";
import { nanoid } from "nanoid";
import { Message, MessageType } from "../schemas/message.schema";
import { format } from "date-fns";

const formatTimestamp = (date: Date): string => {
  return format(date, "h:mm a");
};

const formatDate = (date: Date): string => {
  return format(date, "MMM d, yyyy");
};

export function useMessageOperations() {
  const { db, isLoading: isDbLoading } = useRxDb();

  const addMessage = useCallback(
    async (
      content: string,
      isAiGenerated: boolean = false,
      type: MessageType = "text"
    ) => {
      if (!db || isDbLoading) return null;

      const now = new Date();
      const date = formatDate(now);
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

      await db.collections.messages.insert(newMessage);
      return newMessage.id;
    },
    [db, isDbLoading]
  );

  const getMessageById = useCallback(
    async (id: string): Promise<Message | null> => {
      if (!db || isDbLoading) return null;

      const message = await db.collections.messages.findOne(id).exec();
      return message ? message.toJSON() : null;
    },
    [db, isDbLoading]
  );

  const getMessagesByDate = useCallback(
    async (date: string): Promise<Message[]> => {
      if (!db || isDbLoading) return [];

      const results = await db.collections.messages
        .find()
        .where("date")
        .eq(date)
        .sort({ createdAt: "asc" })
        .exec();

      return results.map((doc) => doc.toJSON());
    },
    [db, isDbLoading]
  );

  const getAllMessages = useCallback(async (): Promise<Message[]> => {
    if (!db || isDbLoading) return [];

    const results = await db.collections.messages
      .find()
      .sort({ createdAt: "asc" })
      .exec();

    return results.map((doc) => doc.toJSON());
  }, [db, isDbLoading]);

  const deleteMessage = useCallback(
    async (id: string): Promise<boolean> => {
      if (!db || isDbLoading) return false;

      const message = await db.collections.messages.findOne(id).exec();
      if (!message) return false;

      await message.remove();
      return true;
    },
    [db, isDbLoading]
  );

  return {
    isLoading: isDbLoading,
    addMessage,
    getMessageById,
    getMessagesByDate,
    getAllMessages,
    deleteMessage,
  };
}
