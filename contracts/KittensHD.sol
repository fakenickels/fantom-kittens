// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./FantomKittens.sol";
import "./HonoraryKittens.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract KittensHD is
  ERC721,
  ERC721Enumerable,
  ERC721URIStorage,
  Ownable,
  IERC2981
{
  using Counters for Counters.Counter;

  Counters.Counter private _tokenIdCounter = Counters.Counter(687);
  Counters.Counter private _generalMintCounter;

  address payable public depositAddress =
    payable(0xC748E6dE30222F4e9bC01812860FF005A82543E6);
  uint256 public maxMintable = 10_000;
  string public baseURI = "https://kittens.fakeworms.studio/api/kitten-hd/";

  uint256 public royaltiesPercentage = 7;

  FantomKittens fantomKittens =
    FantomKittens(0xfD211f3B016a75bC8d73550aC5AdC2f1cAE780C0);

  HonoraryKittens honoraryKittens =
    HonoraryKittens(0xE65469083B4f50d1EcD089584c671Bb1d23F9AC7);

  constructor() ERC721("KittensHD", "KITTENHD") {}

  function _baseURI() internal pure override returns (string memory) {
    return "https://kittens.fakeworms.studio/api/kitten/";
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
    uint256 id = _generalMintCounter.current();

    require(quantity > 0, "Invalid amount");

    _generalMintCounter.increment();
    // 4.2
    uint256 price = getPrice(quantity) * quantity;

    require(msg.value == price, "Invalid amount");
    require(id <= maxMintable, "No more kittens are available");

    // transfer amount to owner
    depositAddress.transfer(price);

    _safeMint(msg.sender, id);
  }

  function ogClaim() public {
    for (uint256 i = 0; i < fantomKittens.balanceOf(msg.sender); i++) {
      uint256 id = fantomKittens.tokenOfOwnerByIndex(msg.sender, i);

      _safeMint(msg.sender, id);
    }
  }

  function honoraryClaim() public {
    for (uint256 i = 0; i < honoraryKittens.balanceOf(msg.sender); i++) {
      uint256 id = honoraryKittens.tokenOfOwnerByIndex(msg.sender, i);

      _safeMint(msg.sender, id);
    }
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 tokenId
  ) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    super._burn(tokenId);
  }

  function tokenURI(uint256 tokenId)
    public
    view
    override(ERC721, ERC721URIStorage)
    returns (string memory)
  {
    return super.tokenURI(tokenId);
  }

  function supportsInterface(bytes4 interfaceId)
    public
    view
    override(ERC721, ERC721Enumerable, IERC165)
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
    uint256 _royalties = (_salePrice * (royaltiesPercentage / 100));
    return (depositAddress, _royalties);
  }
}
