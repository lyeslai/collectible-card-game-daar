// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Collection.sol";

contract Booster is ERC20, Ownable {
    uint8 public constant CARDS_PER_BOOSTER = 5;
    Collection public collection;
    
    event BoosterOpened(address indexed user, string[] cards);
    
    constructor(
        string memory name,
        string memory symbol,
        address collectionAddress,
        address ownerAddress
    ) ERC20(name, symbol) Ownable(ownerAddress) {
        collection = Collection(collectionAddress);
    }

    // Achat de boosters (mint des jetons Booster)
    function buyBooster(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    // Ouvre un booster et retourne un ensemble aléatoire de cartes
    function openBooster() external {
        require(balanceOf(msg.sender) >= 1, "Booster non Disponible");
        _burn(msg.sender, 1); // Brûler un booster
        
        uint256 totalCards = collection.getUniqCardsLength();
        string[] memory cards = new string[](CARDS_PER_BOOSTER);
        
        for (uint256 i = 0; i < CARDS_PER_BOOSTER; i++) {
            uint256 randomIndex = uint256(
                keccak256(abi.encodePacked(block.timestamp, msg.sender, i))
            ) % totalCards;
            cards[i] = collection.UNIQ_CARDS(randomIndex);
        }
        
        emit BoosterOpened(msg.sender, cards);
    }
}