// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Collection is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId; // Variable pour garder la trace du prochain ID de token
    uint256 public constant MAX_TOKENS = 10000; // Limite maximale de tokens
    string[] public UNIQ_CARDS; // Cartes uniques pour cette collection

    // Constructeur pour initialiser la collection de cartes
    constructor(
        address initialOwner,
        string memory name,
        string memory symbol,
        string[] memory UniqCards
    ) ERC721(name, symbol) Ownable(initialOwner) {
        UNIQ_CARDS = UniqCards; // Initialise les cartes uniques
    }

    // Fonction pour créer de nouveaux tokens NFT (mint) avec un URI spécifique (seul l'owner peut le faire)
    function safeMint(address to, string memory uri) external onlyOwner {
        if (_nextTokenId == MAX_TOKENS) revert("Max tokens reached"); // Vérifie que le nombre maximum de tokens n'est pas atteint
        uint256 tokenId = _nextTokenId++; // Génère le nouvel ID de token
        _safeMint(to, tokenId); // Crée le NFT et l'assigne à l'adresse 'to'
        _setTokenURI(tokenId, uri); // Associe les métadonnées (URI) au token
    }

    // Fonction pour récupérer toutes les cartes d'un utilisateur sous forme d'URIs
    function userCards() external view returns (string[] memory) {
        string[] memory cards = new string[](balanceOf(msg.sender)); // Tableau pour stocker les URIs des cartes de l'utilisateur
        for (uint256 i = 0; i < cards.length; i++) {
            cards[i] = tokenURI(tokenOfOwnerByIndex(msg.sender, i)); // Récupère l'URI pour chaque token
        }
        return cards; // Renvoie le tableau d'URIs
    }

    // Fonction interne pour comparer deux chaînes de caractères
    function compare(
        string memory str1,
        string memory str2
    ) internal pure returns (bool) {
        return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2)); // Compare les chaînes en hachant leur contenu
    }

    // Fonction pour obtenir le premier token d'un utilisateur correspondant à une carte donnée (basée sur l'URI)
    function firstTokenOwned(
        address owner,
        string memory card
    ) external view returns (uint256) {
        for (uint256 i = 0; i < balanceOf(owner); i++) {
            if (compare(tokenURI(tokenOfOwnerByIndex(owner, i)), card)) {
                return tokenOfOwnerByIndex(owner, i); // Renvoie l'ID du token si l'URI correspond
            }
        }
        revert(string.concat("Card not owned: ", card)); // Si aucune carte ne correspond, génère une erreur
    }

    // Fonction pour obtenir le nombre de cartes uniques dans cette collection
    function getNbUniqCards() external view returns (uint256) {
        return UNIQ_CARDS.length; // Renvoie la taille du tableau des cartes uniques
    }

    // Fonction pour transférer un token (utilisée uniquement par le propriétaire du contrat)
    function superTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external onlyOwner {
        _transfer(from, to, tokenId); // Effectue le transfert de token entre deux utilisateurs
    }

    // Overrides nécessaires pour combiner ERC721 et ses extensions (Enumerable et URIStorage)
    function _update(
        address to,
        uint256 tokenId,
        address auth
    ) internal override(ERC721, ERC721Enumerable) returns (address) {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(
        address account,
        uint128 value
    ) internal override(ERC721, ERC721Enumerable) {
        super._increaseBalance(account, value);
    }

    // Override de tokenURI pour gérer les métadonnées des tokens
    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // Support des interfaces ERC165 (pour assurer la compatibilité avec ERC721, Enumerable, et URIStorage)
    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    // Fonction pour vérifier combien de tokens sont déjà mintés
    function nbAvailableTokens() internal view returns (uint256) {
        return _nextTokenId; // Renvoie le nombre de tokens mintés jusqu'à maintenant
    }
}
