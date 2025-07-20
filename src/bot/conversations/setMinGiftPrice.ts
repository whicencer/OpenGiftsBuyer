import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context } from "grammy";
import { IConversation } from "./IConversation";
import { userRepository } from "../../database/UserRepository";

export class SetMinGiftPrice implements IConversation {
  name = "setMinGiftPrice";
  constructor() {}

  public async middlewareFn(
    conversation: Conversation<Context, ConversationFlavor<Context>>,
    ctx: ConversationFlavor<Context>
  ) {
    if (!ctx.chat?.id) return;

    const menu = conversation.menu()
      .text("Отмена", ctx => {
        ctx.deleteMessage();
        conversation.halt();
      });
    
    const enterAmountMsg = await ctx.reply("Введите минимальную цену подарка для покупки:", { reply_markup: menu });
    const { message } = await conversation.waitFor("message:text");
    await ctx.deleteMessages([enterAmountMsg.message_id]);
    
    const amount = message.text;
    const numberAmount = Math.floor(Number(amount));
    
    const amountInvalid = isNaN(numberAmount) || numberAmount < 0 || numberAmount > Number.MAX_SAFE_INTEGER;
    if (amountInvalid) {
      await ctx.reply("Неверное значение!");
      return;
    }

    const success = await userRepository.updateAutobuySettings(ctx.chat.id, {
      minPriceToBuy: numberAmount
    });

    if (success) {
      await ctx.reply(`Минимальная цена подарка обновлена: ${numberAmount}`);
      return;
    }

    await ctx.reply("Настройки не были обновлены.");
    await conversation.halt();
  }
}