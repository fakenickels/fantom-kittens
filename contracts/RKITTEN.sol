// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Simple ERC20 contract, we prefer to leave the rest of the funcionality in other contracts
contract RKITTEN is ERC20 {
    constructor() ERC20("Kitten Royalties", "rKITTEN") {
        _mint(msg.sender, 420_000 * 10 ** decimals());
    }
}
