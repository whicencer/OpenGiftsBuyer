import dotenv from "dotenv";
dotenv.config();

import { Bot, Context, GrammyError, HttpError } from "grammy";
import { getEnvVariable } from "../helpers/getEnvVariable";
import logger from "../../config/logger";
import { commands } from "./commands";
import { snipeGifts } from "../utils/snipeGifts";
import { ConversationFlavor, conversations, createConversation } from "@grammyjs/conversations";
import { TBot } from "../types/Bot";
import { registerPaymentListeners } from "./events/payment";
import { menuMiddlewares } from "./menus";
import { scenes } from "./conversations";

export default class BotInstance {
  private bot: TBot = new Bot<ConversationFlavor<Context>>(getEnvVariable("BOT_TOKEN"), {
    client: {
      environment: getEnvVariable("BOT_ENV") as "" || "prod"
    }
  });

  public async run() {
    await this.setCommands();
    this.useMiddleware();
    this.registerHandlers();
    this.bot.start({
      onStart: () => {
        logger.info("Bot running...");
      }
    });
    this.bot.catch((error) => {
      if (error instanceof GrammyError) {
        logger.error("Error in request: ", error.description);
      } else if (error instanceof HttpError) {
        logger.error("HTTP Error: ", error.message);
      } else {
        logger.error("Unknown error: ", error);
      }
    });
    await snipeGifts(this.bot);
  }

  private async useMiddleware() {
    this.bot.use(conversations());
    scenes.forEach((scene) => {
      this.bot.use(createConversation(scene.middlewareFn, scene.name));
    });
    menuMiddlewares.forEach((middlewareFn) => {
      this.bot.use(middlewareFn);
    });
  }

  private registerHandlers() {
    registerPaymentListeners(this.bot);

    commands.forEach(command => {
      this.bot.command(command.name, ...command.middlewares, command.handler);
    });
  }

  private async setCommands() {
    await this.bot.api.setMyCommands([
      { command: "menu", description: "Bot menu" },
      { command: "topup", description: "Top-up bot balance" }
    ]);
  }
}