import { ConversationBuilder, ConversationFlavor } from "@grammyjs/conversations";
import { Context } from "grammy";

export interface IConversation {
  name: string;
  middlewareFn: ConversationBuilder<Context, ConversationFlavor<Context>>;
}