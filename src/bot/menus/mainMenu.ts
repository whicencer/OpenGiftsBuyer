import { ConversationFlavor } from "@grammyjs/conversations";
import { Menu } from "@grammyjs/menu";
import { Context } from "grammy";
import { profileHandler } from "../handlers/profileHandler";
import { autobuySettings } from "../handlers/autobuySettings";

export const mainMenu = new Menu<ConversationFlavor<Context>>("my-menu-identifier")
  .text("🤖 Настройки автопокупки", autobuySettings).row()
  .text("👤 Мой профиль", profileHandler)
  .text("⭐️ Пополнить баланс", async (ctx) => await ctx.conversation.enter("topupBalance"));