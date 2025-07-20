import { SetMaxGiftPrice } from "./setMaxGiftPrice";
import { SetMinGiftPrice } from "./setMinGiftPrice";
import { TopupBalanceScene } from "./topupBalance";

export const scenes = [
  new TopupBalanceScene(),
  new SetMinGiftPrice(),
  new SetMaxGiftPrice()
];