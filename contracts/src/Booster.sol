// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Booster is ERC721, Ownable {
    uint256 public boosterIdCounter;
    mapping(uint256 => string[]) public boosterCards; // Mapping pour stocker les cartes dans chaque booster

    constructor() ERC721("BoosterPackNFT", "BPNFT") {}

    // Fonction pour mint un booster avec des cartes spécifiques
    function mintBooster(address to, string[] memory cardIds) external onlyOwner {
        uint256 newBoosterId = boosterIdCounter;
        _safeMint(to, newBoosterId);
        boosterCards[newBoosterId] = cardIds; // Associer les cartes à ce booster
        boosterIdCounter++;
    }

    // Fonction pour ouvrir un booster et obtenir les cartes
    function openBooster(uint256 boosterId) external {
        require(ownerOf(boosterId) == msg.sender, "Vous netes pas le proprietaire de ce booster.");
        
        // Transfert des cartes du booster à l'utilisateur (on peut imaginer un autre smart contract qui gère les cartes)
        string[] memory cardsInBooster = boosterCards[boosterId];
        // Logique pour transférer les cartes ou les mint

        // Une fois ouvert, le booster peut être détruit
        _burn(boosterId);
    }

    // Fonction pour récupérer les cartes d'un booster sans l'ouvrir
    function getBoosterCards(uint256 boosterId) external view returns (string[] memory) {
        return boosterCards[boosterId];
    }
}
