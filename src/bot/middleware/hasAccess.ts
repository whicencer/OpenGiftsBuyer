import { Context, NextFunction } from "grammy";
import { getEnvVariable } from "../../helpers/getEnvVariable";

export async function hasAccess(ctx: Context, next: NextFunction) {
  if (!ctx.from?.id) return;
  
  const chatId = ctx.from.id;
  const adminId = Number(getEnvVariable("ADMIN_ID"));

  if (chatId === adminId) {
    await next();
  } else {
    await ctx.reply("У вас нет доступа к этому боту. Вы можете создать свой: @OpenGiftsBuyer");
  }
}