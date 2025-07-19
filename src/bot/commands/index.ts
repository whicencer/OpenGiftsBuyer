import { StartCommand } from "./start";
import { TopupCommand } from "./topup";

export const commands = [
  new StartCommand(),
  new TopupCommand()
];