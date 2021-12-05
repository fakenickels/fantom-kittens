// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./HonoraryKittens.sol";
import "./KittensHD.sol";

contract SpecialKittensDistributor is Ownable {
  HonoraryKittens honoraryKittens;

  KittensHD kittensHD;

  mapping(address => bool) public claims;

  constructor(address kittensHDAddress, address honoraryKittensAddress) {
    kittensHD = KittensHD(kittensHDAddress);
    honoraryKittens = HonoraryKittens(honoraryKittensAddress);
  }

  function claim() public {
    require(honoraryKittens.balanceOf(msg.sender) > 0);
    require(!claims[msg.sender], "You've already claimed");

    // check if the sender already minted a kitten hd due to the KittensHD contract bug
    uint256 index = 0;
    while (true) {
      uint256 tokenId_ = kittensHD.tokenOfOwnerByIndex(msg.sender, index);
      require(
        // check if the honorary holder has already minted within the reserved range
        tokenId_ < 667 && tokenId_ > 687,
        "You've already claimed your free HD"
      );
      index++;
    }

    claims[msg.sender] = true;

    // call daoClaim from KittensHD and transfer to msg.sender
    uint256 tokenId = kittensHD.getGeneralMintCounter();
    kittensHD.daoAnyClaim(1);
    kittensHD.safeTransferFrom(address(this), msg.sender, tokenId);
  }
}
