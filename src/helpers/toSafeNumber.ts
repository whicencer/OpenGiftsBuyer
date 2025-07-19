export const toSafeNumber = (val: bigint): number => {
  if (val > BigInt(Number.MAX_SAFE_INTEGER)) {
    throw new Error("Value exceeds JS safe integer range");
  }
  return Number(val);
};