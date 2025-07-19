import { Context } from "grammy";
import { ICommand } from "./ICommand";
import dedent from "dedent";
import logger from "../../../config/logger";
import { getEnvVariable } from "../../helpers/getEnvVariable";
import { userRepository } from "../../database/UserRepository";
import { mainMenu } from "../menus/mainMenu";
import { hasAccess } from "../middleware/hasAccess";

export class StartCommand implements ICommand {
  name = ["start", "menu"];
  middlewares = [hasAccess];
  constructor(){}

  public async handler(ctx: Context) {
    if (!ctx.chat?.id) return;
    const message = dedent`
      🎁 Hello! I’m open-source bot for auto-buying new Telegram Gifts

      <i>creator:</i> @whicencer
      <i>github:</i> https://github.com/whicencer/OpenGiftsBuyer
    `;

    if (ctx.hasCommand("start")) {
      try {
        const adminId = Number(getEnvVariable("ADMIN_ID"));
        const isAdmin = ctx.chat.id === adminId;

        await userRepository.create({
          chatId: ctx.chat.id,
          isAdmin
        });
      } catch (error) {
        logger.error(`Error creating a user: ${error}`);
      }
    }

    await ctx.reply(message, {
      reply_markup: mainMenu,
      parse_mode: "HTML",
      link_preview_options: {is_disabled: true}
    });
  };
}