// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Collection.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Main is Ownable, ERC721 {
    uint256 public collectionCount;
    mapping(uint256 => Collection) public collections;
    mapping(uint256 => Booster) public boosters;
    uint256 public boosterCount;

    struct Booster {
        uint256[] cardIds;
        bool redeemed;
    }

    event CollectionCreated(string name, uint256 cardCount);
    event NFTMinted(address indexed to, uint256 tokenId, uint256 collectionId);
    event BoosterCreated(uint256 boosterId, uint256[] cardIds);
    event BoosterRedeemed(uint256 boosterId, address redeemer);

    constructor() ERC721("Booster", "BSTR") Ownable(msg.sender) {}

    function createCollection(
        string calldata name,
        uint256 cardCount,
        string calldata baseTokenURI
    ) external onlyOwner {
        Collection newCollection = new Collection(name, cardCount, baseTokenURI);
        collections[collectionCount] = newCollection;
        collectionCount++;
        emit CollectionCreated(name, cardCount);
    }

    function mint(uint256 collectionId, address to) external onlyOwner {
        Collection collection = collections[collectionId];
        collection.mint(to);
        emit NFTMinted(to, collection.nextTokenId() - 1, collectionId);
    }

    function createBooster(uint256[] calldata cardIds) external onlyOwner {
        boosters[boosterCount] = Booster(cardIds, false);
        _safeMint(msg.sender, boosterCount);
        emit BoosterCreated(boosterCount, cardIds);
        boosterCount++;
    }

    function redeemBooster(uint256 boosterId) external {
        require(ownerOf(boosterId) == msg.sender, "Not the owner of this booster");
        require(!boosters[boosterId].redeemed, "Booster already redeemed");

        Booster storage booster = boosters[boosterId];
        booster.redeemed = true;

        for (uint i = 0; i < booster.cardIds.length; i++) {
            uint256 collectionId = booster.cardIds[i] / 1000000; // Assuming collection ID is encoded in the first 6 digits
            uint256 cardId = booster.cardIds[i] % 1000000;
            collections[collectionId].mint(msg.sender);
        }

        emit BoosterRedeemed(boosterId, msg.sender);
    }
}
