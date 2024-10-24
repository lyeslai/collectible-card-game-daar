// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Market.sol";

contract Collection is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 public constant MAX_TOKENS = 10000;
    string[] public UNIQ_CARDS;
    uint256 public cardPrice = 0.01 ether;
    Market public market;

    event CardPurchased(address indexed buyer, uint256 tokenId, string cardURI);

    constructor(
        string memory name,
        string memory symbol,
        string[] memory uniqCards,
        address marketAddress
    ) ERC721(name, symbol) Ownable(msg.sender) {
        UNIQ_CARDS = uniqCards;
        market = Market(marketAddress);
    }

    function safeMint(address to, string memory uri) external onlyOwner {
        require(_nextTokenId < MAX_TOKENS, "Max tokens reached");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    function buyCard(uint256 cardId) external payable {
        require(msg.value == cardPrice, "Incorrect Ether value sent");
        require(cardId < UNIQ_CARDS.length, "Card does not exist");
        
        string memory cardURI = UNIQ_CARDS[cardId];
        uint256 tokenId = _nextTokenId;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, cardURI);
        emit CardPurchased(msg.sender, tokenId, cardURI);
        
        _nextTokenId++;  // Incrémenter le token ID pour la prochaine carte
    }

    function listCardForSale(uint256 tokenId, uint256 price) external {
        require(ownerOf(tokenId) == msg.sender, "You do not own this card");
        approve(address(market), tokenId);
        market.listCardForSale(tokenId, price, msg.sender);
    }

    // Récupère le nombre total de cartes disponibles
    function getUniqCardsLength() public view returns (uint256) {
        return UNIQ_CARDS.length;
    }

    // Override nécessaire pour ERC721URIStorage (seulement pour les URIs)
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    // Override de supportsInterface pour assurer la compatibilité
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
