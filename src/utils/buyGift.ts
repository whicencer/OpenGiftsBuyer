import { GrammyError } from "grammy";
import logger from "../../config/logger";
import { Gift } from "@prisma/client";
import { TBot } from "../types/Bot";
import { userRepository } from "../database/UserRepository";

export async function buyGift(userId: number, gift: Gift, bot: TBot): Promise<boolean> {
  try {
    const autobuySettings = await userRepository.getAutobuySettings(userId);
    if (!autobuySettings) return false;

    const minGiftPrice = autobuySettings.minPriceToBuy;
    const maxGiftPrice = autobuySettings.maxPriceToBuy;

    const giftFollowRequirements =
      gift.price >= minGiftPrice
      && gift.price <= maxGiftPrice;

    if (giftFollowRequirements) {
      await bot.api.sendMessage(
        userId,
        `🎁 Подарок[<code>${gift.id}</code>] соответствует ценовым требованиям пользователя.\nПокупка...`,
        { parse_mode: "HTML" }
      );
      
      await bot.api.sendGift(userId, gift.id, { text: "❤️ OpenGiftsBuyer" });
      await userRepository.decrementBalance(userId, gift.price);
      
      return true;
    }
  } catch (error) {
    if (error instanceof GrammyError) {
      logger.error(`Error: ${error.description}`);
      if (error.description === "Bad Request: STARGIFT_USAGE_LIMITED") {
        await bot.api.sendMessage(userId, "❌ Не удалось приобрести подарок. Данный подарок распродан");
        return false;
      }
    } else {
      logger.error("Unexpected error while sending gift: " + error);
    }

    await bot.api.sendMessage(userId, "❌ Не удалось приобрести подарок");
  }

  return false;
}