const depositors = require("./depositors.json");
const fs = require("fs");
const path = require("path");
const ethers = require("ethers");

// get total rKITTEN from LP tokens total

const spLPSupplyAtSnapshot = ethers.utils.parseUnits(
  "1077552805338508478741",
  "wei"
);
const rKITTENInLPsAtSnapshot = ethers.utils.parseUnits(
  "76815775422825393023098",
  "wei"
);

function main() {
  const hdAmount = Object.keys(depositors).reduce((acc, depositor) => {
    return {
      ...acc,
      [depositor]: 1,
    };
  }, {});

  fs.writeFileSync(
    path.join(__dirname, "./hd-amount.json"),
    JSON.stringify(hdAmount, null, 2)
  );
}

main();
