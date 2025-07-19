import BotInstance from "./bot/bot"

(async () => {
  const bot = new BotInstance();
  await bot.run();
})();