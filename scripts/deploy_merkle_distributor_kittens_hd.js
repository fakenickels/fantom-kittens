const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Contract = await hre.ethers.getContractFactory(
    "KittenHDRKittenMerkleDistributor"
  );
  const contract = await Contract.deploy(
    "0xad956DF38D04A9A555E079Cf5f3fA59CB0a25DC9",
    "0xed5efa371ee21eb0bd68bfbd60b61e901f64efc17687ccb6c4e72537ab6fd84d"
  );
  await contract.deployed();

  console.log("Deployed to:", contract.address);

  if (process.env.CHAIN_SCAN_TOKEN) {
    console.log("Verifying ze contract");
    try {
      await hre.run("verify:verify", {
        address: contract.address,
      });
    } catch (e) {
      console.log("Verification failed:", e);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
