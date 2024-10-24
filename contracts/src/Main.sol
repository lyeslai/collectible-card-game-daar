// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Collection.sol";
import "./Booster.sol";
import "./Market.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Main is Ownable {
    Collection public collection;
    Booster public booster;
    Market public market;

    event CollectionCreated(address indexed collectionAddress);
    event BoosterCreated(address indexed boosterAddress);
    event MarketCreated(address indexed marketAddress);

    constructor(
        string memory collectionName,
        string memory collectionSymbol,
        string[] memory uniqCards,
        address ownerAddress
    ) Ownable(ownerAddress) {
        // Création du contrat Market
        market = new Market(address(this), owner());

        // Création de la Collection
        collection = new Collection(
            collectionName,      // Nom de la collection
            collectionSymbol,    // Symbole de la collection
            uniqCards,           // Cartes uniques
            address(market)      // Adresse du Market
        );

        // Création du Booster
        booster = new Booster(
            "BoosterPack",       // Nom du Booster
            "BSTR",              // Symbole du Booster
            address(collection), // Adresse de la Collection
            owner()              // Propriétaire
        );

        emit CollectionCreated(address(collection));
        emit BoosterCreated(address(booster));
        emit MarketCreated(address(market));
    }
    function mintCardToUser(address user, uint256 cardId) external onlyOwner {
    collection.safeMint(user, collection.UNIQ_CARDS(cardId));
}


    // Récupère l'adresse de la collection
    function getCollection() external view returns (Collection) {
        return collection;
    }

    // Récupère l'adresse du marché
    function getMarket() external view returns (Market) {
        return market;
    }

    // Récupère l'adresse du contrat de boosters
    function getBooster() external view returns (Booster) {
        return booster;
    }

    // Fonction pour interagir directement avec le contrat Collection
    function buyCardFromCollection(uint256 cardId) external payable {
        collection.buyCard{value: msg.value}(cardId);
    }

    // Fonction pour lister une carte dans le Market
    function listCardOnMarket(uint256 tokenId, uint256 price) external {
        collection.listCardForSale(tokenId, price);
    }

    // Fonction pour ouvrir un booster
    function openBooster() external {
        booster.openBooster();
    }

    // Fonction pour acheter un booster
    function buyBooster(uint256 amount) external {
        booster.buyBooster(msg.sender, amount);
    }

    // Permet au propriétaire de retirer les fonds accumulés
    function withdrawFunds() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
