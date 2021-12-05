const chai = require("chai");
const expect = chai.expect;
const { solidity } = require("ethereum-waffle");
const merkleRoot = require("../airdrop/kittens-hd-rkitten-airdrop/merkle-root.json");

chai.use(solidity);

describe("Merkle distributor", function () {
  it("should deploy and be able to claim", async function () {
    this.timeout(50000000000000000000000000000000000000);
    const deployer = "0x03D7D343bB9008d182FDB0B9100903f0952bf358";
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [deployer],
    });

    const signer = await ethers.getSigner(deployer);

    const Contract = await ethers.getContractFactory(
      "KittenHDRKittenMerkleDistributor"
    );

    const kittensHDAddress = "0xad956DF38D04A9A555E079Cf5f3fA59CB0a25DC9";

    console.log("Deploying contract...");
    const contract = await Contract.deploy(
      kittensHDAddress,
      merkleRoot.merkleRoot
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
    // uncomment here to test surplus minting when reserved rkitten claim is over and the contract jumps over the general public range
    // await kittensHDContract.daoRKITTENClaim(15);
    // await kittensHDContract.daoRKITTENClaim(10);
    // await kittensHDContract.daoRKITTENClaim(15);
    // await kittensHDContract.daoRKITTENClaim(10);
    // console.log("First one...");
    // await kittensHDContract.daoRKITTENClaim(50);
    // await kittensHDContract.daoRKITTENClaim(50);
    // console.log("Slow...");
    // await kittensHDContract.daoRKITTENClaim(50);
    // await kittensHDContract.daoRKITTENClaim(50);
    // console.log("Almost there...");
    // await kittensHDContract.daoRKITTENClaim(30);

    console.log("Pausing minting...");
    await kittensHDContract.pauseMinting();

    // impersonate claimer

    for (let claimer of Object.keys(merkleRoot.claims)) {
      await hre.network.provider.request({
        method: "hardhat_impersonateAccount",
        params: [claimer],
      });

      await network.provider.send("hardhat_setBalance", [
        claimer,
        "0xffffffffffffffff",
      ]);

      const claimerSigner = await ethers.getSigner(claimer);

      const previousKittensBalance = await kittensHDContract.balanceOf(claimer);

      console.log(`Claiming as ${claimer}...`);
      const receipt = await contract
        .connect(claimerSigner)
        .claim(
          merkleRoot.claims[claimer].index,
          Number(merkleRoot.claims[claimer].amount),
          merkleRoot.claims[claimer].proof
        )
        .then((receipt) => receipt.hash)
        .catch((e) => e.message);

      expect(receipt).to.not.contain(
        `VM Exception while processing transaction: reverted with reason string`
      );

      const balance = await kittensHDContract.balanceOf(claimer);
      console.log(previousKittensBalance.toNumber());

      console.log("Claimed balance", balance.toNumber());
      expect(balance).to.equal(
        previousKittensBalance.toNumber() +
          Number(merkleRoot.claims[claimer].amount)
      );
    }

    // const claimer = "0x075c3AD6ae22F995dbf89671c5F166343b4D415d";
    // await hre.network.provider.request({
    //   method: "hardhat_impersonateAccount",
    //   params: [claimer],
    // });

    // await network.provider.send("hardhat_setBalance", [
    //   claimer,
    //   "0xffffffffffffffff",
    // ]);

    // const claimerSigner = await ethers.getSigner(claimer);

    // const previousKittensBalance = await kittensHDContract.balanceOf(claimer);

    // console.log(`Claiming as ${claimer}...`);
    // const receipt = await contract
    //   .connect(claimerSigner)
    //   .claim(
    //     merkleRoot.claims[claimer].index,
    //     Number(merkleRoot.claims[claimer].amount),
    //     merkleRoot.claims[claimer].proof
    //   )
    //   .then((receipt) => receipt.hash)
    //   .catch((e) => e.message);

    // expect(receipt).to.not.contain(
    //   `VM Exception while processing transaction: reverted with reason string`
    // );

    // const balance = await kittensHDContract.balanceOf(claimer);

    // expect(balance).to.equal(
    //   previousKittensBalance.add(Number(merkleRoot.claims[claimer].amount))
    // );

    // console.log("Should not allow to claim twice");

    // const receiptTwo = await contract
    //   .connect(claimerSigner)
    //   .claim(
    //     merkleRoot.claims[claimer].index,
    //     Number(merkleRoot.claims[claimer].amount),
    //     merkleRoot.claims[claimer].proof
    //   )
    //   .then((receipt) => receipt.hash)
    //   .catch((e) => e.message);

    // expect(receiptTwo).to.contain(
    //   `VM Exception while processing transaction: reverted with reason string`
    // );
  });
});
