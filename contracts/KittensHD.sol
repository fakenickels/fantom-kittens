// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./FantomKittens.sol";
import "./HonoraryKittens.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract KittensHD is
  ERC721,
  ERC721Enumerable,
  Ownable,
  IERC2981,
  AccessControl
{
  using Strings for uint256;
  using Counters for Counters.Counter;

  Counters.Counter private _rkittenClaimCounter = Counters.Counter(688);
  Counters.Counter private _honoraryClaimCounter = Counters.Counter(667);
  Counters.Counter private _daoClaimCounter = Counters.Counter(419);
  Counters.Counter private _generalMintCounter = Counters.Counter(1021);

  // bool to track whether the minting is enabled
  bool private _mintingEnabled = true;

  address payable public depositAddress =
    payable(0xC748E6dE30222F4e9bC01812860FF005A82543E6);
  uint256 public maxMintable = 10_000;
  string public baseURI = "https://kittens.fakeworms.studio/api/kitten-hd/";

  uint256 public royaltiesPercentage = 7;

  FantomKittens fantomKittens =
    FantomKittens(0xfD211f3B016a75bC8d73550aC5AdC2f1cAE780C0);

  HonoraryKittens honoraryKittens =
    HonoraryKittens(0xE65469083B4f50d1EcD089584c671Bb1d23F9AC7);

  bytes32 public constant DAO_MEMBER = keccak256("DAO_MEMBER");

  constructor() ERC721("KittensHD", "KITTENHD") {
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    _setupRole(DAO_MEMBER, msg.sender);
    // Worms
    _setupRole(DAO_MEMBER, 0xCA88C5D43Bb11eDBcBC1436fEFA9d578d8D64489);
  }

  // get rkitten claim counter current value
  function getRKittenClaimCounter() public view returns (uint256) {
    return _rkittenClaimCounter.current();
  }

  // get honorary claim counter current value
  function getHonoraryClaimCounter() public view returns (uint256) {
    return _honoraryClaimCounter.current();
  }

  // get dao claim counter current value
  function getDaoClaimCounter() public view returns (uint256) {
    return _daoClaimCounter.current();
  }

  // get general mint counter current value
  function getGeneralMintCounter() public view returns (uint256) {
    return _generalMintCounter.current();
  }

  function grantDAOMemberRole(address addr)
    public
    onlyRole(DEFAULT_ADMIN_ROLE)
  {
    _setupRole(DAO_MEMBER, addr);
  }

  function _baseURI() internal view override returns (string memory) {
    return baseURI;
  }

  // method to pause the minting of new tokens
  function pauseMinting() public onlyRole(DAO_MEMBER) {
    _mintingEnabled = false;
  }

  // method to unpause the minting of new tokens
  function unpauseMinting() public onlyRole(DAO_MEMBER) {
    _mintingEnabled = true;
  }

  function setDepositAddress(address payable to) public onlyOwner {
    depositAddress = to;
  }

  function setRoyaltiesPercentage(uint256 newPercentage) public onlyOwner {
    royaltiesPercentage = newPercentage;
  }

  function setBaseURI(string memory newURI) public onlyOwner {
    baseURI = newURI;
  }

  // get price based on quantity
  function getPrice(uint256 quantity) public pure returns (uint256) {
    if (quantity >= 10) {
      return 4.0 ether;
    } else if (quantity >= 3) {
      return 4.1 ether;
    } else {
      return 4.2 ether;
    }
  }

  function claim(uint256 quantity) public payable {
    require(quantity > 0, "Invalid amount");
    require(_mintingEnabled, "Minting is paused");

    uint256 id = _generalMintCounter.current();
    uint256 price = getPrice(quantity) * quantity;

    require(msg.value >= price, "Invalid amount");
    require(id < maxMintable, "No more kittens are available");

    // transfer amount to owner
    depositAddress.transfer(price);

    // mint for quantity
    for (uint256 i = 0; i < quantity; i++) {
      uint256 id = _generalMintCounter.current();
      require(id < maxMintable, "No more kittens are available");
      _safeMint(msg.sender, id);

      _generalMintCounter.increment();
    }
  }

  function daoAnyClaim(uint256 quantity) public onlyRole(DAO_MEMBER) {
    require(quantity > 0, "Invalid amount");
    require(_mintingEnabled, "Minting is paused");

    uint256 id = _generalMintCounter.current();

    require(id < maxMintable, "No more kittens are available");

    // mint for quantity
    for (uint256 i = 0; i < quantity; i++) {
      uint256 id = _generalMintCounter.current();
      _safeMint(msg.sender, id);

      _generalMintCounter.increment();
    }
  }

  function daoRKITTENClaim(uint256 amount) public onlyRole(DAO_MEMBER) {
    for (uint256 i = 0; i < amount; i++) {
      uint256 id = _rkittenClaimCounter.current();

      _safeMint(msg.sender, id);
      _rkittenClaimCounter.increment();
    }
  }

  function ogClaim() public {
    require(_mintingEnabled, "Minting is paused");
    require(fantomKittens.balanceOf(msg.sender) > 0, "No OG Kittens");
    for (uint256 i = 0; i < fantomKittens.balanceOf(msg.sender); i++) {
      uint256 id = fantomKittens.tokenOfOwnerByIndex(msg.sender, i);

      _safeMint(msg.sender, id);
    }
  }

  function honoraryClaim() public {
    require(_mintingEnabled, "Minting is paused");
    require(honoraryKittens.balanceOf(msg.sender) > 0, "No honorary kittens");
    require(
      _honoraryClaimCounter.current() <= 687,
      "All reserved honorary claims are over"
    );

    for (uint256 i = 0; i < honoraryKittens.balanceOf(msg.sender); i++) {
      uint256 id = _honoraryClaimCounter.current();

      _safeMint(msg.sender, id);
      _honoraryClaimCounter.increment();
    }
  }

  function _daoClaim() public onlyRole(DAO_MEMBER) {
    uint256 id = _daoClaimCounter.current();

    require(id <= 1020, "No more kittens are available for DAO claim");

    _safeMint(msg.sender, id);

    _daoClaimCounter.increment();
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721)
    returns (string memory)
  {
    require(
      _exists(tokenId),
      "ERC721Metadata: URI query for nonexistent token"
    );

    string memory baseURI = _baseURI();
    return
      bytes(baseURI).length > 0
        ? string(abi.encodePacked(baseURI, tokenId.toString(), ".json"))
        : "";
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, IERC165, AccessControl)
    returns (bool)
  {
    return
      type(IERC2981).interfaceId == interfaceId ||
      super.supportsInterface(interfaceId);
  }

  function royaltyInfo(uint256 tokenId, uint256 _salePrice)
    external
    view
    override(IERC2981)
    returns (address receiver, uint256 royaltyAmount)
  {
    uint256 _royalties = ((_salePrice * royaltiesPercentage) / 100);
    return (depositAddress, _royalties);
  }
}
