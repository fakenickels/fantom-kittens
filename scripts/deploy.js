const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const NFTMinter = await hre.ethers.getContractFactory("FantomKittens");
  const nftMinter = await NFTMinter.deploy("FantomKittens", "KITTEN");
  await nftMinter.deployed();

  console.log("Deployed to:", nftMinter.address);

  if(process.env.CHAIN_SCAN_TOKEN) {
    console.log("Verifying ze contract")
    await hre.run("verify:verify", {
      address: nftMinter.address,
      constructorArguments: [
        "FantoKittens",
        "KITTEN"
      ],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });