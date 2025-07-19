import { ConversationFlavor } from "@grammyjs/conversations";
import { Menu } from "@grammyjs/menu";
import { Context } from "grammy";
import { profileHandler } from "../handlers/profileHandler";
import dedent from "dedent";

export const mainMenu = new Menu<ConversationFlavor<Context>>("my-menu-identifier")
  .text("🤖 Настройки автопокупки", (ctx) => {
    const message = dedent`
      Сейчас для настройки используйте файл <code>autobuyConfig.ts</code> в коде проекта
      В течении нескольких дней этот функционал будет перенесён в бота.
    `;
    ctx.reply(message, { parse_mode: "HTML" });
  }).row()
  .text("👤 Мой профиль", profileHandler)
  .text("⭐️ Пополнить баланс", async (ctx) => await ctx.conversation.enter("topupBalance"));