import { ConversationFlavor } from "@grammyjs/conversations";
import { Bot, Context } from "grammy";

export type TBot = Bot<ConversationFlavor<Context>>;