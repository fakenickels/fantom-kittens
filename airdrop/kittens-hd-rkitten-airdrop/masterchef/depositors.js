const ethers = require("ethers");
const MasterKitten = require("../../../artifacts/contracts/MasterKitten.sol/MasterKitten.json");
const fs = require("fs");
const path = require("path");

const provider = new ethers.providers.JsonRpcProvider(
  "https://rpcapi.fantom.network"
);
const contract = new ethers.Contract(
  "0x88361C5cEc6524B1D46172a0c40B55B632961c61",
  MasterKitten.abi,
  provider
);

const contractCreationBlock = 20071927;
const filter = contract.filters.Deposit();

console.log("Getting deposits...");
contract
  .queryFilter(filter, contractCreationBlock)
  .then((events) => {
    console.log("Found " + events.length + " events");
    // transform deposits to json removing duplicate entries

    const usersAndAmount = events
      // filter out all events that happened after Kittens HD deployment
      .filter((event) => event.blockNumber < 22716527)
      .reduce((acc, event) => {
        if (event.args.amount.toString() === "0") {
          return acc;
        }

        return {
          ...acc,
          [event.args.user]: event.args.amount.toString(),
        };
      }, {});

    console.log(
      "Found " + Object.keys(usersAndAmount).length + " unique wallet deposits"
    );
    // save users as json to file
    fs.writeFileSync(
      path.join(__dirname, "./depositors.json"),
      JSON.stringify(usersAndAmount, null, 2)
    );
  })
  .catch((e) => {
    console.log(e);
  });
