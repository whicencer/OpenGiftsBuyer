import { Gift } from "@prisma/client";
import logger from "../../config/logger";
import dedent from "dedent";
import { InputFile } from "grammy";
import { TBot } from "../types/Bot";

export async function sendNewGiftNotification(
  bot: TBot,
  chatId: number,
  gift: Gift,
) {
  const message = dedent`
    🆕 <b>New gift available!</b>
    
    Price: ⭐️ <b>${gift.price}</b>
    Quantity: <b>${gift.totalSupply || "Not limited"}</b>
  `;

  try {
    const file = await bot.api.getFile(gift.stickerFileId);
    const stickerMessage = await bot.api.sendDocument(chatId, new InputFile(new URL(`https://api.telegram.org/file/bot${bot.token}/${file.file_path}`)));
    await bot.api.sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_parameters: { message_id: stickerMessage.message_id }
    });
  } catch (error) {
    logger.error("Error sending notification: " + error);
  }
}