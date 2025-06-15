import { RxJsonSchema } from "rxdb";

export type MessageType = "text";

export type Message = {
  id: string;
  type: MessageType;
  content: string;
  timestamp: string;
  date: string;
  isAiGenerated: boolean;
  createdAt: number;
};

export const messageSchema: RxJsonSchema<Message> = {
  title: "messages",
  version: 0,
  type: "object",
  properties: {
    id: { type: "string", maxLength: 100 },
    type: { type: "string", enum: ["text"] },
    content: { type: "string", maxLength: 5000 },
    timestamp: { type: "string" },
    date: { type: "string" },
    isAiGenerated: { type: "boolean", default: false },
    createdAt: { type: "number" },
  },
  required: [
    "id",
    "type",
    "content",
    "timestamp",
    "date",
    "createdAt",
    "isAiGenerated",
  ],
  primaryKey: "id",
};
