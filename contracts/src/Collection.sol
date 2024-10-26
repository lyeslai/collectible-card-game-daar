// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract Collection is ERC721, Ownable {
    uint256 public cardCount;
    uint256 public nextTokenId;
    string public baseTokenURI;

    constructor(
        string memory _collectionName,
        uint256 _cardCount,
        string memory _baseTokenURI
    ) ERC721(_collectionName, "NFTC") Ownable(msg.sender) {
        cardCount = _cardCount;
        baseTokenURI = _baseTokenURI;
        nextTokenId = 1;
    }

    function mint(address to) external onlyOwner {
        require(nextTokenId <= cardCount, "All cards have been minted.");
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseTokenURI, Strings.toString(tokenId)));
    }
}
