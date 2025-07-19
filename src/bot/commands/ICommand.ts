import { ConversationFlavor } from "@grammyjs/conversations";
import { Context, Middleware } from "grammy";

export interface ICommand {
  name: string | string[],
  middlewares: Array<Middleware<Context>>;
  handler: (ctx: ConversationFlavor<Context>) => Promise<void> | void;
}