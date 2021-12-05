const rkittenSnapshot = require("./rkitten-snapshot.json");
const fs = require("fs");
const path = require("path");
const excludedAddresses = [
  "0xc748e6de30222f4e9bc01812860ff005a82543e6",
  "0xec5aec9eb2fadc4d09475b20f2ef34e399df3d17",
  "0x88361c5cec6524b1d46172a0c40b55b632961c61",
  "0x07e796368ac8480f74b57eba6391733ede0dcad7",
];
function main() {
  const finalSnapshot = rkittenSnapshot
    .filter(
      (holder) =>
        holder.Balance > 420 &&
        !excludedAddresses.includes(holder.HolderAddress)
    )
    .reduce((acc, holder) => {
      return {
        ...acc,
        [holder.HolderAddress]: Math.ceil(holder.Balance / 420),
      };
    }, {});

  console.log(
    "Total Kittens HD reserved",
    Object.keys(finalSnapshot).reduce((acc, key) => acc + finalSnapshot[key], 0)
  );

  fs.writeFileSync(
    path.join(__dirname, "./rkitten-final-amount.json"),
    JSON.stringify(finalSnapshot, null, 2)
  );
}

main();
