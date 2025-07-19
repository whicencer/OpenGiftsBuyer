import { Context } from "grammy";
import { userRepository } from "../../database/UserRepository";
import dedent from "dedent";

export const profileHandler = async (ctx: Context) => {
  const chatId = ctx.chat?.id
  if (!chatId) return;

  const user = await userRepository.findById(chatId);
  const message = dedent`
    👤 <b>${ctx.chat.first_name}</b>  
    Ваш ID: <code>${chatId}</code>  
    Баланс: ⭐ <b>${user?.starBalance}</b>
  `;

  await ctx.reply(message, {
    parse_mode: "HTML"
  });
}