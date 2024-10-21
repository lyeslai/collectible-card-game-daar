// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "@openzeppelin/contracts/access/Ownable.sol";d
import "./Booster.sol";

contract Collection is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    string[] public UNIQ_CARDS;
    uint256 public card_price = 0.01 ether;
    uint256 public constant MAX_TOKENS = 10000;
    Booster private booster; 

    event cardPurchased(address indexed buyer, uint256 tokenId, string cardURI );

    // Constructeur pour initialiser la collection de cartes
    constructor(
        address initialOwner,
        string memory name,
        string memory symbol,
        string[] memory UniqCards
    ) ERC721(name, symbol) Ownable(initialOwner) {
        UNIQ_CARDS = UniqCards;
        booster = new Booster (name, symbol, address(this));
    }

        // Fonction pour créer de nouveaux tokens NFT (mint) avec un URI spécifique (seul l'owner peut le faire)
    function safeMint(address to, string memory uri) external onlyOwner {
        if (_nextTokenId == MAX_TOKENS) revert("Max tokens reached"); // Vérifie que le nombre maximum de tokens n'est pas atteint
        uint256 tokenId = _nextTokenId++; // Génère le nouvel ID de token
        _safeMint(to, tokenId); // Crée le NFT et l'assigne à l'adresse 'to'
        _setTokenURI(tokenId, uri); // Associe les métadonnées (URI) au token
    }


    function buyCard(uint256 cardId) external payable {
        require(msg.value == card_price, "Mauvaise valeur");
        require (cardId < UNIQ_CARDS.length, "Carte Inexistante");

        string memory cardURI = UNIQ_CARDS[cardId];
        _safeMint(msg.sender, _nextTokenId);
        _setTokenURI(_nextTokenId, cardURI);

        emit CardPurchased(msg.sender, _nextTokenId, cardURI);
        _nextTokenId++;
    }


    // Fonction pour récupérer toutes les cartes d'un utilisateur sous forme d'URIs
    function userCards() external view returns (string[] memory) {
        string[] memory cards = new string[](balanceOf(msg.sender)); // Tableau pour stocker les URIs des cartes de l'utilisateur
        for (uint256 i = 0; i < cards.length; i++) {
            cards[i] = tokenURI(tokenOfOwnerByIndex(msg.sender, i)); // Récupère l'URI pour chaque token
        }
        return cards; // Renvoie le tableau d'URIs
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