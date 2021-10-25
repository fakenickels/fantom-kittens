const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  // console.log("Deploying contracts with the account:", deployer.address);
  // console.log("Account balance:", (await deployer.getBalance()).toString());

  const rKittenAddress = "0x07e796368ac8480f74b57eba6391733ede0dcad7";
  const ownerAddress = "0xC10F558700972312119afBc7b6eBEdDc8e8ef4BC";
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
