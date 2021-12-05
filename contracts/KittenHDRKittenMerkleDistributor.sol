// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./KittensHD.sol";

// Allows anyone to claim a token if they exist in a merkle root.
interface IMerkleDistributor {
  // Returns the address of the token distributed by this contract.
  function kittensHDAddress() external view returns (address);

  // Returns the merkle root of the merkle tree containing account balances available to claim.
  function merkleRoot() external view returns (bytes32);

  // Returns true if the index has been marked claimed.
  function isClaimed(uint256 index) external view returns (bool);

  // Claim the given amount of the token to the given address. Reverts if the inputs are invalid.
  function claim(
    uint256 index,
    uint256 amount,
    bytes32[] calldata merkleProof
  ) external;

  // This event is triggered whenever a call to #claim succeeds.
  event Claimed(uint256 index, address account, uint256 amount);
}

contract KittenHDRKittenMerkleDistributor is
  IMerkleDistributor,
  IERC721Receiver
{
  address public immutable override kittensHDAddress;
  bytes32 public immutable override merkleRoot;

  // This is a packed array of booleans.
  mapping(uint256 => uint256) private claimedBitMap;

  constructor(address token_, bytes32 merkleRoot_) {
    kittensHDAddress = token_;
    merkleRoot = merkleRoot_;
  }

  function isClaimed(uint256 index) public view override returns (bool) {
    uint256 claimedWordIndex = index / 256;
    uint256 claimedBitIndex = index % 256;
    uint256 claimedWord = claimedBitMap[claimedWordIndex];
    uint256 mask = (1 << claimedBitIndex);
    return claimedWord & mask == mask;
  }

  function _setClaimed(uint256 index) private {
    uint256 claimedWordIndex = index / 256;
    uint256 claimedBitIndex = index % 256;
    claimedBitMap[claimedWordIndex] =
      claimedBitMap[claimedWordIndex] |
      (1 << claimedBitIndex);
  }

  function claim(
    uint256 index,
    uint256 amount,
    bytes32[] calldata merkleProof
  ) external override {
    require(!isClaimed(index), "MerkleDistributor: Drop already claimed.");

    // Verify the merkle proof.
    bytes32 node = keccak256(abi.encodePacked(index, msg.sender, amount));
    require(
      MerkleProof.verify(merkleProof, merkleRoot, node),
      "MerkleDistributor: Invalid proof."
    );

    // Mark it claimed and send the token.
    _setClaimed(index);

    KittensHD kittensHD = KittensHD(kittensHDAddress);
    uint256 currentTokenId = kittensHD.getRKittenClaimCounter();

    if (currentTokenId + amount > 1020) {
      uint256 amountToMint = 1020 - currentTokenId;
      uint256 surplus = amount - amountToMint;
      // claim NFTs
      kittensHD.daoRKITTENClaim(amountToMint);

      // transfer rkitten amount back to sender from address(this)
      for (uint256 i = 0; i < amountToMint; i++) {
        kittensHD.safeTransferFrom(
          address(this),
          msg.sender,
          currentTokenId + i
        );
      }

      // mint surplus from daoAnyClaim
      uint256 generalCurrentId = kittensHD.getGeneralMintCounter();
      kittensHD.unpauseMinting();
      kittensHD.daoAnyClaim(surplus);
      // transfer rkitten amount back to sender from address(this)
      for (uint256 i = 0; i < surplus; i++) {
        kittensHD.safeTransferFrom(
          address(this),
          msg.sender,
          generalCurrentId + i
        );
      }
      kittensHD.pauseMinting();
    } else {
      // claim NFTs
      kittensHD.daoRKITTENClaim(amount);

      // transfer rkitten amount back to sender from address(this)
      for (uint256 i = 0; i < amount; i++) {
        kittensHD.safeTransferFrom(
          address(this),
          msg.sender,
          currentTokenId + i
        );
      }
    }

    emit Claimed(index, msg.sender, amount);
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
