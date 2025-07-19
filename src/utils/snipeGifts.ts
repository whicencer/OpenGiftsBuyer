import { GrammyError } from "grammy";
import logger from "../../config/logger";
import { sleep } from "../helpers/sleep";
import { TBot } from "../types/Bot";
import { distributeGifts } from "./distributeGifts";
import { giftRepository } from "../database/GiftRepository";

export async function snipeGifts(bot: TBot) {
  while (true) {
    try {
      const { gifts: currentGifts } = await bot.api.getAvailableGifts();
      const existingGifts = await giftRepository.getGifts();

      const existingIds = new Set(existingGifts.map(gift => gift.id));
      const newLimitedGifts = currentGifts.filter(gift => !existingIds.has(gift.id) && gift.total_count);

      const savedGifts = [];
      for (const gift of newLimitedGifts) {
        const newGift = await giftRepository.addGift(gift);
        if (newGift) savedGifts.push(newGift);
      }
      
      await distributeGifts(savedGifts, bot);
    } catch (error) {
      if (error instanceof GrammyError) {
        logger.error(`Error: ${error.description}`);
      } else {
        logger.error(`Unexpected error while getting available gifts: ${error}`);
      }
    }
    await sleep(10*1000);
  }
}