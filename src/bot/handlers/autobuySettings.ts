import { Context } from "grammy";
import { userRepository } from "../../database/UserRepository";
import { autobuySettingsMenu } from "../menus/autobuySettingsMenu";
import dedent from "dedent";

export const autobuySettings = async (ctx: Context) => {
  if (!ctx.chat?.id) return;

  const user = await userRepository.findById(ctx.chat.id, true);
  const message = dedent`
    🤖 Настройки автопокупки

    <b>Цена подарка</b>
    Мин: ⭐ <b>${user?.autobuySettings?.minPriceToBuy || "None"}</b>
    Макс: ⭐ <b>${user?.autobuySettings?.maxPriceToBuy || "None"}</b>
  `;
  
  await ctx.reply(message, { reply_markup: autobuySettingsMenu, parse_mode: "HTML" });
}