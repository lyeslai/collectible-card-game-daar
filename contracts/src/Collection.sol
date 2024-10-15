// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "./Card.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract Collection is Ownable{
  string public name;
  uint256 public cardCount;
  uint256 public mintedCardCount;
  Card public cardContract;


  constructor (string memory _name, uint256 _cardCount, address _cardContract) {
    name = _name;
    cardCount = _cardCount;
    mintedCardCount = 0;
    cardContract = Card(_cardContract);
  }
}
