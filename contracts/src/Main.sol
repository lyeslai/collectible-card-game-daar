// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Booster.sol";


contract Main is Ownable {
  uint256 public nbCollections;
  mapping(string => Collection) public collections;

  event CollectionCreated(string name, address collectionAddress);

  constructor() {}

  
    function createCollection(
        string calldata name,
        string calldata symbol,
        string[] calldata uniqCards
    ) external onlyOwner {
        Collection newCollection = new Collection(owner(), name, symbol, uniqCards);
        collections[name] = newCollection;
        nbCollections++;

        emit CollectionCreated(name, address(newCollection));
    }

    // Voir une collection par nom
    function getCollection(string calldata name) external view returns (Collection) {
        return collections[name];
    }
}
