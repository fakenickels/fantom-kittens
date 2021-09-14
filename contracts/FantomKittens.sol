// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FantomKittens is ERC721, ERC721URIStorage, Ownable, ERC721Enumerable {
    address payable public depositAddress = payable(0xC748E6dE30222F4e9bC01812860FF005A82543E6);
    uint256 public maxMintable = 420;

    constructor() ERC721("FantomKittens", "KITTEN") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://kittens.fakeworms.studio/api/kitten/";
    }

    function setDepositAddress(address payable to) public onlyOwner {
        depositAddress = to;
    }

    function claim(uint256 id) public payable {
        uint256 price = 42.0 ether;

        // Magic number price
        if(id == 419) {
            require(msg.value == 420 ether, "Invalid amount");
        } else {
            require(msg.value == price, "Invalid amount");
            require(id < (maxMintable - 1), "Invalid id");
        }

        // transfer amount to owner
        depositAddress.transfer(price);

        _safeMint(msg.sender, id);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
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
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}