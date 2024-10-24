// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";



contract Collection is ERC721, Ownable {
    uint256 public cardCount;
    uint256 public nextTokenId;
    string public baseTokenURI;

    // Le constructeur doit passer les arguments requis par ERC721 et Ownable
    constructor(
        string memory _collectionName,
        uint256 _cardCount,
        string memory _baseTokenURI
    ) ERC721(_collectionName, "NFTC") Ownable(msg.sender) { // On appelle le constructeur Ownable ici
        cardCount = _cardCount;
        baseTokenURI = _baseTokenURI;
        nextTokenId = 1; // Les ID des cartes commencent à 1
    }

    // Fonction pour mint des cartes
function mint(address to) external onlyOwner {
    require(nextTokenId <= uint256(cardCount), "All cards have been minted.");
    console.log("Minting token", nextTokenId, "to", to);
    _safeMint(to, nextTokenId);
    nextTokenId++;
    console.log("Token minted, new nextTokenId:", nextTokenId);
}

    // URI des métadonnées
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(baseTokenURI, Strings.toString(tokenId)));
    }
}
