import { messageSchema } from "./message.schema";

export * from "./message.schema";

export const collections = {
  messages: {
    schema: messageSchema,
  },
};
