
const chai = require("chai")
const expect = chai.expect
const { solidity } = require("ethereum-waffle");

chai.use(solidity)

describe("rKITTEN contract", function () {
  let owner;
  let depositAddress;

  this.beforeAll(async () => {
    [owner, user] = await ethers.getSigners();
  })

  it("should mint a token properly and transfer amount to owner address", async function () {
    const Contract = await ethers.getContractFactory("RKITTEN");

    const contract = await Contract.deploy();

    expect(await contract.balanceOf(await owner.getAddress())).to.equal((new ethers.utils.parseEther("420000")))
  });

  it("initialize pool", async function () {
    const RKITTENContract = await ethers.getContractFactory("RKITTEN");
    const rKitten = await RKITTENContract.deploy();

    const Contract = await ethers.getContractFactory("MasterKitten");

    const contract = await Contract.deploy(rKitten.address, await owner.getAddress(), 1e18 / 10);

    expect(await contract.balanceOf(await owner.getAddress())).to.equal((new ethers.utils.parseEther("420000")))
  });
});