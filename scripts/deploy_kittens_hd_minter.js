const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Contract = await hre.ethers.getContractFactory("KittensHDPublicMinter");
  const kittensHDAddress = "0xad956DF38D04A9A555E079Cf5f3fA59CB0a25DC9";
  const depositAddress = "0xc748e6de30222f4e9bc01812860ff005a82543e6";
  const contract = await Contract.deploy(kittensHDAddress, depositAddress);
  await contract.deployed();

  console.log("Deployed to:", contract.address);

  // get KittensHD contract and call grantDAOMemberRole for contract.address
  const kittensHDContract = await ethers.getContractAt(
    "KittensHD",
    kittensHDAddress,
    deployer
  );

  console.log("Granting role...");
  await kittensHDContract.grantDAOMemberRole(contract.address);

  if (process.env.CHAIN_SCAN_TOKEN && hre.network.name === "mainnet") {
    console.log("Verifying ze contract");
    await hre.run("verify:verify", {
      address: contract.address,
      constructorArguments: [kittensHDAddress, depositAddress],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
