// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Card is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;


    constructor() ERC721("CardToken", "CARD") {
        nextTokenId = 0;
    }


    function mint(address to , string memory _tokenURI) external onlyOwner{

        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, _tokenURI);          
    }

    function updateTokenURI(uint256 tokenId, string memory _tokenURI) external onlyOwner {
        _setTokenURI(tokenId, _tokenURI);
    }

}
