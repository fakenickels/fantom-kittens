const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // console.log("Deploying contracts with the account:", deployer.address);
  // console.log("Account balance:", (await deployer.getBalance()).toString());

  const rKittenAddress = "0x32ebfed3b4d7a9c547beb530e3728987920cb1cc";
  const ownerAddress = await deployer.getAddress();
  const Contract = await hre.ethers.getContractFactory("MasterKitten");
  const args = [
    rKittenAddress,
    ownerAddress,
    "4861111111000000"
  ] 
  const contract = await Contract.deploy(...args);
  await contract.deployed();

  console.log("Deployed to:", contract.address);

  if (process.env.CHAIN_SCAN_TOKEN) {
    console.log("Verifying ze contract");
    await hre.run("verify:verify", {
      address: contract.address,
      constructorArguments: [
        rKittenAddress,
        ownerAddress,
        "4861111111000000",
      ],
    });
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
