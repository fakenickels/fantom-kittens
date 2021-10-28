
const chai = require("chai")
const expect = chai.expect
const { solidity } = require("ethereum-waffle");
const { Container } = require("postcss");

chai.use(solidity)

describe("FantomKittens contract", function () {
  let owner;
  let depositAddress;

  this.beforeAll(async () => {
    [owner, depositAddress, someFucker] = await ethers.getSigners();

  })

  it("should mint a token properly and transfer amount to deposit address", async function () {
    const depositAddressInitialBalance = await depositAddress.getBalance()
    const Contract = await ethers.getContractFactory("FantomKittens");

    const contract = await Contract.deploy();

    await contract.setDepositAddress(await depositAddress.getAddress())

    const receipt = await contract.claim({
      value: ethers.utils.parseEther("4.2"),
    }).catch(e => e.message)

    expect(receipt).to.not.equal(`VM Exception while processing transaction: reverted with reason string 'Invalid amount'`)
    expect(await depositAddress.getBalance()).to.equal(ethers.utils.parseEther("4.2").add(depositAddressInitialBalance))
    expect(await contract.balanceOf(await owner.getAddress())).to.equal(1)
  });


  it("should not mint if user didn't send the right amount", async function () {
    const Contract = await ethers.getContractFactory("FantomKittens");

    const contract = await Contract.deploy();

    await contract.setDepositAddress(await depositAddress.getAddress())

    const receipt = await contract.claim({
      value: ethers.utils.parseEther("2.0"),
    }).catch(e => e.message)

    expect(receipt).to.equal(`VM Exception while processing transaction: reverted with reason string 'Invalid amount'`)
  });

  it("only contract owner should change the deposit address", async function () {
    const Contract = await ethers.getContractFactory("FantomKittens");

    const contract = await Contract.deploy();

    const contractFuckerSigner = contract.connect(someFucker)

    const receipt = await contractFuckerSigner.setDepositAddress(await someFucker.getAddress()).catch(e => e.message)

    expect(receipt).to.equal(`VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'`)
  });
});

describe("Kitten name service", function() {
  it(`should properly name a name`, async () => {
    const [owner, depositAddress] = await ethers.getSigners(); 

    const Contract = await ethers.getContractFactory("FantomKittens");

    const contract = await Contract.deploy();

    await contract.setDepositAddress(await depositAddress.getAddress())

    const _receipt = await contract.claim({
      value: ethers.utils.parseEther("4.2"),
    }).catch(e => e.message)

    const KNS = await ethers.getContractFactory("KittenNameService");
    const Affinity = await ethers.getContractFactory("Affinity");
    const affinity = await Affinity.deploy(contract.address);
    const kns = await KNS.deploy(contract.address, affinity.address)

    // transfer from owner to affinity address
    await contract.approve(affinity.address, 0);
    await contract["safeTransferFrom(address,address,uint256)"](await owner.getAddress(), affinity.address, 0);

    expect(await contract.ownerOf(0)).to.equal(affinity.address);

    // check affinity balance after petting
    await affinity.pet(0);
    expect(await affinity.affinityBalanceOf(0)).to.equal(1);

    // expect to be able to change name after petting and have affinity balance of 1
    const newName = "Giorno Giovanna"
    const kittenId = 0
    const receipt = await kns.setKittenName(kittenId, newName).catch(e => e.message)

    expect(await kns.names(kittenId)).to.equal(newName)
    
    // withdraw kitten back and expect to have affinity balance resetted
    await affinity.withdrawKitten(0);
    expect(await affinity.affinityBalanceOf(0)).to.equal(0);
    expect(await contract.ownerOf(0)).to.equal(await owner.getAddress())
  })

  it(`shouldn't let pet someone else's kitten`, async () => {
    const [owner, depositAddress, someoneElse] = await ethers.getSigners(); 

    const Contract = await ethers.getContractFactory("FantomKittens");

    const contract = await Contract.deploy();

    await contract.setDepositAddress(await depositAddress.getAddress())

    const _receipt = await contract.claim({
      value: ethers.utils.parseEther("4.2"),
    }).catch(e => e.message)

    const KNS = await ethers.getContractFactory("KittenNameService");
    const Affinity = await ethers.getContractFactory("Affinity");
    const affinity = await (await Affinity.deploy(contract.address)).connect(someoneElse);
    const kns = await KNS.deploy(contract.address, affinity.address)

    // transfer from owner to affinity address
    await contract.approve(affinity.address, 0);
    await contract["safeTransferFrom(address,address,uint256)"](await owner.getAddress(), affinity.address, 0);
    expect(await contract.ownerOf(0)).to.equal(affinity.address);

    expect(await affinity.pet(0).catch(e => e.message)).to.contain("reverted")
    expect(await affinity.affinityBalanceOf(0)).to.equal(0);

    // expect to be able to change name after petting and have affinity balance of 1
    const newName = "Giorno Giovanna"
    const kittenId = 0
    const receipt = await kns.setKittenName(kittenId, newName).catch(e => e.message)

    expect(receipt).to.contain("reverted")
    expect(await kns.names(kittenId)).to.not.equal(newName)
  })

  it(`shouldn't let change name if not enough affinity`, async () => {
    const [owner, depositAddress] = await ethers.getSigners(); 

    const Contract = await ethers.getContractFactory("FantomKittens");

    const contract = await Contract.deploy();

    await contract.setDepositAddress(await depositAddress.getAddress())

    const _receipt = await contract.claim({
      value: ethers.utils.parseEther("4.2"),
    }).catch(e => e.message)

    const KNS = await ethers.getContractFactory("KittenNameService");
    const Affinity = await ethers.getContractFactory("Affinity");
    const affinity = await Affinity.deploy(contract.address);
    const kns = await KNS.deploy(contract.address, affinity.address)

    // transfer from owner to affinity address
    await contract.approve(affinity.address, 0);
    await contract["safeTransferFrom(address,address,uint256)"](await owner.getAddress(), affinity.address, 0);

    expect(await contract.ownerOf(0)).to.equal(affinity.address);

    // no petting no balance
    expect(await affinity.affinityBalanceOf(0)).to.equal(0);

    // expect to be able to change name after petting and have affinity balance of 1
    const newName = "Giorno Giovanna"
    const kittenId = 0
    const receipt = await kns.setKittenName(kittenId, newName).catch(e => e.message)

    expect(receipt).to.contain("Transaction reverted")
    expect(await kns.names(kittenId)).to.not.equal(newName)
  })

  it(`shouldn't let petting twice in a row without waiting a day`, async () => {
    const [owner, depositAddress] = await ethers.getSigners(); 

    const Contract = await ethers.getContractFactory("FantomKittens");

    const contract = await Contract.deploy();

    await contract.setDepositAddress(await depositAddress.getAddress())

    const _receipt = await contract.claim({
      value: ethers.utils.parseEther("4.2"),
    }).catch(e => e.message)

    const KNS = await ethers.getContractFactory("KittenNameService");
    const Affinity = await ethers.getContractFactory("Affinity");
    const affinity = await Affinity.deploy(contract.address);
    const kns = await KNS.deploy(contract.address, affinity.address)

    // transfer from owner to affinity address
    await contract.approve(affinity.address, 0);
    await contract["safeTransferFrom(address,address,uint256)"](await owner.getAddress(), affinity.address, 0);

    expect(await contract.ownerOf(0)).to.equal(affinity.address);

    // check affinity balance after petting
    await affinity.pet(0);
    expect(await affinity.affinityBalanceOf(0)).to.equal(1);

    expect(await affinity.pet(0).catch(e => e.message)).to.contain("reverted");

    const oneDay =  24 * 60 * 60;
 
    await ethers.provider.send('evm_increaseTime', [oneDay]);
    await ethers.provider.send('evm_mine');

    // check affinity balance after petting
    await affinity.pet(0);
    expect(await affinity.affinityBalanceOf(0)).to.equal(2);
  })
})