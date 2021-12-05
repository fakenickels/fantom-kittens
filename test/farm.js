const chai = require("chai");
const expect = chai.expect;
const { solidity } = require("ethereum-waffle");

chai.use(solidity);

describe("rKITTEN contract", function () {
  let owner;
  let depositAddress;

  this.beforeAll(async () => {
    [owner, user] = await ethers.getSigners();
  });

  it("should mint a token properly and transfer amount to owner address", async function () {
    const Contract = await ethers.getContractFactory("RKITTEN");

    const contract = await Contract.deploy();

    expect(await contract.balanceOf(await owner.getAddress())).to.equal(
      new ethers.utils.parseEther("420000")
    );
  });
});
