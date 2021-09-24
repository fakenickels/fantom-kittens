// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract KittenNameService {
  mapping(uint256 => string) public names; 
  address owner;
  ERC721 Kittens = ERC721(0xfD211f3B016a75bC8d73550aC5AdC2f1cAE780C0);

  constructor() {
    owner = msg.sender;
  }

  function setKittenName(uint256 kittenId, string memory newKittenName) public {
    require(Kittens.ownerOf(kittenId) == msg.sender, "You do not own this kitten");

    names[kittenId] = newKittenName;
  }

  function setKittensAddress(address addr) public {
    require(msg.sender == owner, "Only owner");

    Kittens = ERC721(addr);
  }
}