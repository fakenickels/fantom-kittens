const path = require("path");
const fs = require("fs");
const masterChefFinal = require("./masterchef/hd-amount.json");
const rkittenFinal = require("./rkitten-snapshot/rkitten-final-amount.json");

// sum both keys of masterChefFinal and rKittenFinal into a new object
function main() {
  const final = {};
  Object.keys(masterChefFinal).forEach((key) => {
    final[key.toLowerCase()] = masterChefFinal[key];
  });

  Object.keys(rkittenFinal).forEach((key) => {
    final[key.toLowerCase()] =
      (final[key.toLowerCase()] || 0) + rkittenFinal[key];
  });

  fs.writeFileSync(
    path.join(__dirname, "final-amount.json"),
    JSON.stringify(final, null, 2)
  );

  const finalDrop = Object.keys(final).reduce(
    (acc, key) => acc + final[key],
    0
  );
  console.log(`Total: ${finalDrop}`);
}

main();
