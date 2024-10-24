// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Collection.sol";

contract Main {
    address public owner;
    uint256 public collectionCount;

    // Mapping from collection ID to Collection contract
    mapping(uint256 => Collection) public collections;

    event CollectionCreated(string name, uint256 cardCount);
    event NFTMinted(address indexed to, uint256 tokenId, uint256 collectionId);

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function createCollection(string calldata name, uint256 cardCount, string calldata baseTokenURI) external onlyOwner {
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

    // Fallback function to catch invalid calls
    fallback() external payable {
        revert("Function not recognized");
    }

    // Receive function for payments (if required)
    receive() external payable {}
}
