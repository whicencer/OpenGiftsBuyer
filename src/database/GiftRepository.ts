import { type Gift as TelegramGift } from "grammy/types";
import { prisma } from "./client";
import { Gift } from "@prisma/client";
import logger from "../../config/logger";

class GiftRepository {
  public async addGift(gift: TelegramGift): Promise<Gift | void> {
    try {
      const newGift = await prisma.gift.create({
        data: {
          id: gift.id,
          price: gift.star_count,
          stickerFileId: gift.sticker.file_id,
          totalSupply: gift.total_count
        }
      });

      return newGift;
    } catch (error) {
      logger.error("Error adding new gift: ", error);
    }
  }

  public async getGifts(): Promise<Gift[]> {
    return await prisma.gift.findMany();
  }
}

export const giftRepository = new GiftRepository();