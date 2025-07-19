import { Gift } from "@prisma/client";
import { getEnvVariable } from "../helpers/getEnvVariable";
import { buyGift } from "./buyGift";
import { TBot } from "../types/Bot";
import { userRepository } from "../database/UserRepository";

export async function distributeGifts(newGifts: Gift[], bot: TBot) {
  const userChatId = Number(getEnvVariable("ADMIN_ID"));
  
  while (true) {
    let purchaseMade = false;
    
    for (const gift of newGifts) {
      const balance = await userRepository.getBalance(userChatId);
      
      if (balance && gift.price > balance) continue;
      if (balance === 0) break;
      purchaseMade = await buyGift(userChatId, gift, bot);
    }

    if (!purchaseMade) break;
  }
}