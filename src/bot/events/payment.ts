import { Context } from "grammy";
import { userRepository } from "../../database/UserRepository";
import logger from "../../../config/logger";
import { TBot } from "../../types/Bot";
import { invoiceRepository } from "../../database/InvoiceRepository";

export function registerPaymentListeners(bot: TBot) {
  bot.on("pre_checkout_query", handlePreCheckoutQuery);
  bot.on(":successful_payment", handleSuccessfulPayment);
}

export async function handleSuccessfulPayment(ctx: Context) {
  if (!ctx.update.message?.successful_payment || !ctx.from?.id) return;

  const successfulPayment = ctx.update.message.successful_payment;
  const { invoice_payload, total_amount, telegram_payment_charge_id } = successfulPayment;

  try {
    await userRepository.topupBalance(
      ctx.from.id,
      total_amount
    );
    await invoiceRepository.updateInvoiceStatusSuccess(invoice_payload, telegram_payment_charge_id);
    await ctx.reply(`✅ Баланс успешно пополнен на ⭐<b>${total_amount}</b>`, { parse_mode: "HTML" });
  } catch (error) {
    logger.error(`Error on successful payment: ${error}`);
  }
}

export async function handlePreCheckoutQuery(ctx: Context) {
  if (!ctx.preCheckoutQuery) return;

  const { id, invoice_payload } = ctx.preCheckoutQuery;

  const invoice = await invoiceRepository.findById(invoice_payload);
  if (!invoice) {
    await ctx.api.sendMessage(ctx.preCheckoutQuery.from.id, "Счёт не найден.");
    await ctx.api.answerPreCheckoutQuery(id, false, { error_message: "Счёт не найден." });
    return;
  };

  if (invoice?.isPaid) {
    await ctx.api.sendMessage(ctx.preCheckoutQuery.from.id, "Этот счёт уже оплачен.");
    await ctx.api.answerPreCheckoutQuery(id, false, {
      error_message: "Этот счёт уже оплачен."
    });
    return;
  }

  await ctx.api.answerPreCheckoutQuery(id, true);
}