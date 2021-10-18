const fs = require("fs");
const path = require("path");
const BigNumber = require("bignumber.js");

// kittens that were in paintswap's escrow during snapshot
const NON_ELIGIBLE = 16;
const KITTENS_SUPPLY = 419 - NON_ELIGIBLE;
const RKITTENS_AIRDROP_AMOUNT = 150_000;
const RKITTEN_PER_KITTEN = new BigNumber(RKITTENS_AIRDROP_AMOUNT).dividedBy(
  KITTENS_SUPPLY
);

const [head, ...snapshot] = fs
  .readFileSync(path.join(__dirname, "snapshop_1.csv"))
  .toString()
  .split("\n");

const finalAirdrop = snapshot.map((line) => {
  const [wallet, kittensAmount] = line.split(",");

  return [wallet.trim(), RKITTEN_PER_KITTEN.multipliedBy(kittensAmount)];
});

// console.log("DEBUG\n FINAL SUM");
// console.log(
//   finalAirdrop.reduce((acc, [_, amount]) => amount.plus(acc), new BigNumber(0)).toNumber()
// );
// console.log("DEBUG");

const finalFormat = finalAirdrop
  .map(([wallet, amount]) => `${wallet},${amount.toNumber()}`)
  .join("\n");

console.log(finalFormat);
