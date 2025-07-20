import { ConversationFlavor } from "@grammyjs/conversations";
import { Menu } from "@grammyjs/menu";
import { Context } from "grammy";

export const autobuySettingsMenu = new Menu<ConversationFlavor<Context>>("autobuy_settings_menu")
  .text("Изменить от ⭐", async (ctx) => await ctx.conversation.enter("setMinGiftPrice"))
  .text("Изменить до ⭐", async (ctx) => await ctx.conversation.enter("setMaxGiftPrice"));