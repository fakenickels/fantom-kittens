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

    const Contract = await ethers.getContractFactory("KittensHDPublicMinter");

    const kittensHDAddress = "0xad956DF38D04A9A555E079Cf5f3fA59CB0a25DC9";

    console.log("Deploying contract...");
    const contract = await Contract.deploy(
      kittensHDAddress,
      await user.getAddress()
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

    const receipt = await contract
      .connect(user)
      .claim(20, {
        value: ethers.utils.parseEther("80.0"),
      })
      .then((receipt) => receipt.hash)
      .catch((e) => e.message);

    console.log(receipt);
    expect(receipt).to.not.contain(
      `VM Exception while processing transaction: reverted with reason string`
    );
    expect(receipt).to.not.contain(`Transaction reverted:`);

    const balance = await kittensHDContract.balanceOf(await user.getAddress());

    expect(balance).to.equal(20);
  });
});
