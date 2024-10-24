// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Collection.sol";

contract Main {
    address public owner;
    int public collectionCount;
    mapping(int => address) public collections; // Associer un ID de collection à l'adresse du contrat Collection

    event CollectionCreated(int indexed collectionId, address collectionAddress);

    constructor() {
        owner = msg.sender;
        collectionCount = 0;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Vous netes pas le proprietaire.");
        _;
    }

    // Créer une nouvelle collection
    function createCollection(string calldata name, int cardCount, string calldata baseTokenURI) external onlyOwner {
        Collection newCollection = new Collection(name, cardCount, baseTokenURI);
        collections[collectionCount] = address(newCollection);
        emit CollectionCreated(collectionCount, address(newCollection));
        collectionCount++;
    }

    // Récupérer l'adresse d'une collection
    function getCollectionAddress(int collectionId) external view returns (address) {
        return collections[collectionId];
    }
}
