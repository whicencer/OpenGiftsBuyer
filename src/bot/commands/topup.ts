import { Context } from "grammy";
import { ICommand } from "./ICommand";
import { ConversationFlavor } from "@grammyjs/conversations";
import { hasAccess } from "../middleware/hasAccess";

export class TopupCommand implements ICommand {
  name: string = "topup";
  middlewares = [hasAccess];
  constructor() {}

  public async handler(ctx: ConversationFlavor<Context>) {
    await ctx.conversation.enter("topupBalance");
  }
}