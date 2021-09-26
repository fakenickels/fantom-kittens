// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract Affinity is IERC721Receiver {
  // owner to id, id to affinity count
  mapping(uint256 => uint256) public kittensAffinities; 

  mapping(uint256 => address) public ownerOf; 

  mapping(uint256 => uint256) public lastPetting;

  uint256 public emission = 1;

  address owner;
  ERC721 Kittens = ERC721(0xfD211f3B016a75bC8d73550aC5AdC2f1cAE780C0);

  constructor(address kittensAddress) {
    owner = msg.sender;
    Kittens = ERC721(kittensAddress);
  }

  function affinityBalanceOf(uint256 tokenId) view public returns (uint256) {
    return kittensAffinities[tokenId];
  }

  function pet(uint256 tokenId) public returns(uint256 affinity) {
    require(msg.sender == ownerOf[tokenId], "Only owner");
    require(Kittens.ownerOf(tokenId) == address(this));
    require(lastPetting[tokenId] == 0 || (block.timestamp - lastPetting[tokenId]) >= 1 days, "Cannot call twice in a day");

    kittensAffinities[tokenId] += emission;
    lastPetting[tokenId] = block.timestamp;

    affinity = kittensAffinities[tokenId];
  }

  function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external override(IERC721Receiver) returns (bytes4) {
    ownerOf[tokenId] = from;
    return this.onERC721Received.selector;
  }

  function withdrawKitten(uint256 tokenId) public {
    require(ownerOf[tokenId] == msg.sender);

    kittensAffinities[tokenId] = 0;

    Kittens.approve(msg.sender, tokenId);
    Kittens.safeTransferFrom(address(this), msg.sender, tokenId);
  }

  function setEmission(uint256 amount) public {
    require(msg.sender == owner);
    emission = amount;
  }
}