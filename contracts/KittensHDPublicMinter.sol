// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./KittensHD.sol";

contract KittensHDPublicMinter is Ownable, IERC721Receiver {
  KittensHD kittensHD;

  // bool to track whether the minting is enabled
  bool public _mintingEnabled = true;

  address payable public depositAddress;

  constructor(address kittensHDAddress, address _depositAddress) {
    kittensHD = KittensHD(kittensHDAddress);
    depositAddress = payable(_depositAddress);
  }

  function claim(uint256 quantity) public payable {
    require(_mintingEnabled, "Minting is paused");

    uint256 currentId = kittensHD.getGeneralMintCounter();

    require((quantity + currentId) < 10_000, "Invalid quantity");

    uint256 amount = kittensHD.getPrice(quantity) * quantity;

    require(msg.value == amount, "Invalid amount");

    depositAddress.transfer(amount);

    kittensHD.unpauseMinting();
    kittensHD.daoAnyClaim(quantity);
    for (uint256 i = 0; i < quantity; i++) {
      kittensHD.safeTransferFrom(address(this), msg.sender, i + currentId);
    }
    kittensHD.pauseMinting();
  }

  function withdraw() public onlyOwner {
    depositAddress.transfer(address(this).balance);
  }

  // method to pause the minting of new tokens
  function pauseMinting() public onlyOwner {
    _mintingEnabled = false;
  }

  // method to unpause the minting of new tokens
  function unpauseMinting() public onlyOwner {
    _mintingEnabled = true;
  }

  function onERC721Received(
    address operator,
    address from,
    uint256 tokenId,
    bytes calldata data
  ) external override returns (bytes4) {
    return this.onERC721Received.selector;
  }
}
