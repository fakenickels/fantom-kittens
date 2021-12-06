const chai = require("chai");
const expect = chai.expect;
const { solidity } = require("ethereum-waffle");
const merkleRoot = require("../airdrop/kittens-hd-rkitten-airdrop/merkle-root.json");

chai.use(solidity);

describe("KittensHD minter", function () {
  it("should deploy and be able to claim", async function () {
    this.timeout(50000000000000000000000000000000000000);
    const [user] = await ethers.getSigners();
    const deployer = "0x03D7D343bB9008d182FDB0B9100903f0952bf358";
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [deployer],
    });

    const signer = await ethers.getSigner(deployer);

    const Contract = await ethers.getContractFactory(
      "SpecialKittensDistributor"
    );

    const kittensHDAddress = "0xad956DF38D04A9A555E079Cf5f3fA59CB0a25DC9";
    const honoraryKittensAddress = "0xE65469083B4f50d1EcD089584c671Bb1d23F9AC7";

    console.log("Deploying contract...");
    const contract = await Contract.deploy(
      kittensHDAddress,
      honoraryKittensAddress
    );

    console.log("Initializing kittens hd");
    const kittensHDContract = await ethers.getContractAt(
      "KittensHD",
      kittensHDAddress,
      signer
    );

    // setup merkle distributor
    console.log("Granting role...");
    await kittensHDContract.grantDAOMemberRole(contract.address);

    console.log("Pausing minting...");
    await kittensHDContract.pauseMinting();

    const honoraryHolderAddress = "0x0fdBAeCF59193e8Ff96d9b392B8C24E892AE2b26";
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [honoraryHolderAddress],
    });

    await network.provider.send("hardhat_setBalance", [
      honoraryHolderAddress,
      "0xffffffffffffffff",
    ]);

    const honoraryHolder = await ethers.getSigner(honoraryHolderAddress);

    const receipt = await contract
      .connect(honoraryHolder)
      .claim()
      .then((receipt) => receipt.hash)
      .catch((e) => e.message);

    expect(receipt).to.not.contain(
      `VM Exception while processing transaction: reverted with reason string`
    );
    expect(receipt).to.not.contain(`Transaction reverted:`);

    const balance = await kittensHDContract.balanceOf(honoraryHolderAddress);

    expect(balance).to.equal(1);

    const shouldFailReceipt = await contract
      .connect(honoraryHolder)
      .claim()
      .then((receipt) => receipt.hash)
      .catch((e) => e.message);
    // should not be able to claim twice for a honorary kitten ticket
    expect(shouldFailReceipt).to.contain(`You've already claimed this token`);
    // not honorary holder = fail
    expect(
      await contract
        .connect(user)
        .claim()
        .then((receipt) => receipt.hash)
        .catch((e) => e.message)
    ).to.contain(`You don't have any honorary kittens`);

    const incidentMinterAddress = "0x9945daF5dCd39C9A3556d27c16af343765e5630C";
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [incidentMinterAddress],
    });

    const incidentMinter = await ethers.getSigner(incidentMinterAddress);
    expect(
      await contract
        .connect(incidentMinter)
        .claim()
        .then((receipt) => receipt.hash)
        .catch((e) => e.message)
    ).to.contain(`You've already claimed your free HD`);
  });
});
