// SPDX-License-Identifier: MIT
pragma solidity ^0.8;


import "./Card.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Collection.sol";

contract Main {
  int private count;
  mapping(int => Collection) private collections;

  constructor () {
    count = 0;
  }

  function createCollection(string calldata name, int cardCount) external {
    collections[count++] = new Collection(name, cardCount);
  }
}
