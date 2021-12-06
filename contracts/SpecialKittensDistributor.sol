// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./HonoraryKittens.sol";
import "./KittensHD.sol";

contract SpecialKittensDistributor is Ownable, IERC721Receiver {
  HonoraryKittens honoraryKittens;

  KittensHD kittensHD;

  mapping(uint256 => bool) public claimBitmap;

  constructor(address kittensHDAddress, address honoraryKittensAddress) {
    kittensHD = KittensHD(kittensHDAddress);
    honoraryKittens = HonoraryKittens(honoraryKittensAddress);
  }

  function claim() public {
    require(
      honoraryKittens.balanceOf(msg.sender) > 0,
      "You don't have any honorary kittens"
    );

    // check if the sender already minted a kitten hd due to the KittensHD contract bug

    // for of kittenHD.balance of msg.sender
    for (uint256 index = 0; index < kittensHD.balanceOf(msg.sender); index++) {
      uint256 tokenId_ = kittensHD.tokenOfOwnerByIndex(msg.sender, index);
      require(
        // check if the honorary holder has already minted within the reserved range
        tokenId_ < 667 || tokenId_ > 687,
        "You've already claimed your free HD"
      );
    }

    // check if honorary kitten was already "spent"
    for (
      uint256 index = 0;
      index < honoraryKittens.balanceOf(msg.sender);
      index++
    ) {
      uint256 tokenId_ = honoraryKittens.tokenOfOwnerByIndex(msg.sender, index);
      require(!claimBitmap[tokenId_], "You've already claimed this token");
      claimBitmap[tokenId_] = true;
    }

    // call daoClaim from KittensHD and transfer to msg.sender
    uint256 tokenId = kittensHD.getGeneralMintCounter();

    kittensHD.unpauseMinting();
    kittensHD.daoAnyClaim(1);
    kittensHD.safeTransferFrom(address(this), msg.sender, tokenId);
    kittensHD.pauseMinting();
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
