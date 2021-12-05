const hre = require("hardhat");
const merkleRoot = require("../airdrop/kittens-hd-rkitten-airdrop/merkle-root.json");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Contract = await hre.ethers.getContractFactory(
    "KittenHDRKittenMerkleDistributor"
  );
  const kittensHDAddress = "0xad956DF38D04A9A555E079Cf5f3fA59CB0a25DC9";
  const contract = await Contract.deploy(
    kittensHDAddress,
    merkleRoot.merkleRoot
  );
  await contract.deployed();

  console.log("Deployed to:", contract.address);

  const kittensHDContract = await ethers.getContractAt(
    "KittensHD",
    kittensHDAddress,
    deployer
  );

  console.log("Granting role...");
  await kittensHDContract.grantDAOMemberRole(contract.address);

  if (process.env.CHAIN_SCAN_TOKEN) {
    console.log("Verifying ze contract");
    try {
      await hre.run("verify:verify", {
        address: contract.address,
        constructorArguments: [kittensHDAddress, merkleRoot.merkleRoot],
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
