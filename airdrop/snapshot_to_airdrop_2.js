const fs = require("fs");
const path = require("path");
const BigNumber = require("bignumber.js");

// kittens that were in paintswap's escrow during snapshot
const RKITTENS_AIRDROP_AMOUNT = 50_000;

const [, ...snapshot] = fs
  .readFileSync(path.join(__dirname, "snapshop_1.csv"))
  .toString()
  .split("\n")
  .map((line) => line.split(",")[0]);

const [, ...snapshot_2] = fs
  .readFileSync(path.join(__dirname, "snapshot_2.csv"))
  .toString()
  .split("\n")
  .map((line) => line.split(","));

// excludes all wallets in snapshot_2 that are in snapshot_1
const airdrop_2 = snapshot_2.filter(
  ([wallet, ...rest]) => !snapshot.includes(wallet)
);

const kittensInSnapshot = airdrop_2.reduce(
  (acc, [_, kittens]) => acc + Number(kittens),
  0
);

const RKITTEN_PER_KITTEN = new BigNumber(RKITTENS_AIRDROP_AMOUNT).dividedBy(
  kittensInSnapshot
);

const finalFormat = airdrop_2
  // ratio the airdrop is based on the total amount of rkittens
  .map(([wallet, amount]) => [
    wallet,
    new BigNumber(amount).times(RKITTEN_PER_KITTEN),
  ])
  .map(([wallet, amount]) => `${wallet},${amount.toNumber()}`)
  .join("\n");

console.log(finalFormat);
