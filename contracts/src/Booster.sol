// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Collection.sol";


contract Booster is ERC20, ERC20Burnable {
  event BoosterResult(address, string[]);
  uint8 public constant CARD_PER_BOOSTER = 5;
  Collection public referenceCollection;

  event BoosterOpened (address indexed opener , string[] cards);


  constructor(
    string memory name,
    string memory symbol,
    address collectionAddress
  ) ERC20(name, symbol) {
    referenceCollection = collection(collectionAddress);
  }

  function mint(address to, uint256 amount) external onlyOwner{
    _mint(to, amount);
  }

     function openBooster() external {
        require(balanceOf(msg.sender) >= 1, "You don't have a booster to open");
        _burn(msg.sender, 1); // Brûler un booster

        uint256 nbCards = referenceCollection.getNbUniqueCards();
        string[] memory cards = new string[](CARDS_PER_BOOSTER);
        for (uint256 i = 0; i < CARDS_PER_BOOSTER; i++) {
            uint256 cardIndex = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, i))) % nbCards;
            cards[i] = referenceCollection.UNIQ_CARDS(cardIndex);
        }

        emit BoosterOpened(msg.sender, cards);
    }
}