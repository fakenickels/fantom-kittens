// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC2981.sol";

contract HonoraryKittens is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable, IERC2981 {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    address payable public defaultReceiver = payable(0xC748E6dE30222F4e9bC01812860FF005A82543E6);
    mapping(uint256 => address payable) public royaltyReceivers;
    mapping(uint256 => string) public kittenURIs;
    uint256 public constant royaltiesPercentage = 5;

    constructor() ERC721("HonoraryKittens", "HKITTENS") {}

    function mintNew(address payable creator, string memory metadataUri) public onlyOwner returns (uint256 createdId) {
        uint256 id = _tokenIdCounter.current();
        _safeMint(msg.sender, _tokenIdCounter.current());
        
        royaltyReceivers[id] = creator;
        kittenURIs[id] = metadataUri;
        
        _tokenIdCounter.increment();
        
        createdId = id;
    }
    
    function setKittenRoyaltyReceiver(uint256 tokenId, address payable creator) public onlyOwner {
        royaltyReceivers[tokenId] = creator;
    }
    
    function setKittenMetadataURI(uint256 tokenId, string memory metadataUri) public onlyOwner {
        kittenURIs[tokenId] = metadataUri;
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
        return kittenURIs[tokenId];
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, IERC165)
        returns (bool)
    {
        return type(IERC2981).interfaceId == interfaceId || super.supportsInterface(interfaceId);
    }

    // IERC2981 - Royalities
    /// @notice Getter function for _royaltiesReceiver
    /// @return the address of the royalties recipient
    function royaltiesReceiver() external view returns(address) {
        return defaultReceiver;
    }

    /// @notice Changes the royalties' recipient address (in case rights are transferred for instance)
    /// @param newRoyaltiesReceiver - address of the new royalties recipient
    function setRoyaltiesReceiver(address payable newRoyaltiesReceiver) external onlyOwner {
        require(newRoyaltiesReceiver != defaultReceiver); // dev: Same address
        defaultReceiver = newRoyaltiesReceiver;
    }

    /// @notice Called with the sale price to determine how much royalty
    //          is owed and to whom.
    ///         param _tokenId - the NFT asset queried for royalty information (not used)
    /// @param _salePrice - sale price of the NFT asset specified by _tokenId
    /// @return receiver - address of who should be sent the royalty payment
    /// @return royaltyAmount - the royalty payment amount for _value sale price
    function royaltyInfo(uint256 tokenId, uint256 _salePrice) external view override(IERC2981) returns (address receiver, uint256 royaltyAmount) {
        uint256 _royalties = (_salePrice * royaltiesPercentage) / 100;
        address creatorAddress = royaltyReceivers[tokenId];
        return (creatorAddress, _royalties);
    }    
}