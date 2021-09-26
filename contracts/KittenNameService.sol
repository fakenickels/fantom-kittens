// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Affinity.sol";

contract KittenNameService {
  mapping(uint256 => string) public names; 
  address owner;
  uint256 affinityCost = 1;
  ERC721 Kittens = ERC721(0xfD211f3B016a75bC8d73550aC5AdC2f1cAE780C0);
  Affinity AffinityContract;

  constructor(address kittensAddress, address affinityAddress) {
    owner = msg.sender;
    Kittens = ERC721(kittensAddress);
    AffinityContract = Affinity(affinityAddress);
  }

  function setKittenName(uint256 kittenId, string memory newKittenName) public {
    require(Kittens.ownerOf(kittenId) == address(AffinityContract), "Kitten is not locked in Affinity");
    require(AffinityContract.ownerOf(kittenId) == msg.sender, "You do not own this kitten");
    require(AffinityContract.affinityBalanceOf(kittenId) >= affinityCost);
    require(bytes(newKittenName).length < 16, "Max name length is 15 chars");

    names[kittenId] = newKittenName;
  }

  function setKittensAddress(address addr) public {
    require(msg.sender == owner, "Only owner");

    Kittens = ERC721(addr);
  }
}