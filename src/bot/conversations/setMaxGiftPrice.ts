import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context } from "grammy";
import { IConversation } from "./IConversation";
import { userRepository } from "../../database/UserRepository";

export class SetMaxGiftPrice implements IConversation {
  name = "setMaxGiftPrice";
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
    
    const enterAmountMsg = await ctx.reply("Введите максимальную цену подарка для покупки:", { reply_markup: menu });
    const { message } = await conversation.waitFor("message:text");
    await ctx.deleteMessages([enterAmountMsg.message_id]);
    
    const amount = message.text;
    const numberAmount = Math.floor(Number(amount));
    
    const amountInvalid = isNaN(numberAmount) || numberAmount < 1 || numberAmount > Number.MAX_SAFE_INTEGER;
    if (amountInvalid) {
      await ctx.reply("Неверное значение!");
      return;
    }

    const success = await userRepository.updateAutobuySettings(ctx.chat.id, {
      maxPriceToBuy: numberAmount
    });

    if (success) {
      await ctx.reply(`Максимальная цена подарка обновлена: ${numberAmount}`);
      return;
    }

    await ctx.reply("Настройки не были обновлены.");
    await conversation.halt();
  }
}