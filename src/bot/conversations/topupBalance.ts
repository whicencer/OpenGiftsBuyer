import { Conversation, ConversationFlavor } from "@grammyjs/conversations";
import { Context } from "grammy";
import { invoiceRepository } from "../../database/InvoiceRepository";
import { IConversation } from "./IConversation";

export class TopupBalanceScene implements IConversation {
  name: string = "topupBalance";
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
    
    await ctx.reply("Введите количество звёзд для пополнения:", { reply_markup: menu });
    const { message } = await conversation.waitFor("message:text");

    const amount = message.text;
    const numberAmount = Math.floor(Number(amount));
    if (isNaN(numberAmount) || numberAmount < 1) {
      await ctx.reply("Неверно ввели количество звёзд для пополнения!");
      return;
    }

    if (numberAmount > 10000) {
      await ctx.reply("Максимальная сумма для пополнения – ⭐️10.000!");
      return;
    }

    const createdInvoice = await invoiceRepository.createInvoice({
      starAmount: numberAmount,
      userChatId: ctx.chat.id
    });

    if (!createdInvoice) {
      await ctx.reply("Не удалось создать счёт. Попробуйте снова.");
      return;
    }

    await ctx.replyWithInvoice(
      "🌟 Пополнение баланса",
      "Пополните баланс для покупки подарков",
      createdInvoice.id,
      "XTR",
      [{ label: "Topup bot balance", amount: numberAmount }]
    );
  }
}