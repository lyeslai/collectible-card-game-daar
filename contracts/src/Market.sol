// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Market is Ownable {
    struct Listing {
        uint256 price;
        address seller;
        bool active;
    }

    mapping(uint256 => Listing) public listings;

    event CardListed(uint256 tokenId, uint256 price, address seller);
    event CardSold(uint256 tokenId, uint256 price, address buyer, address seller);

    IERC721 public nftCollection;

    // Ajout d'un argument explicite pour le propriétaire
    constructor(address _nftCollection, address _owner) Ownable(_owner) {
        nftCollection = IERC721(_nftCollection);
    }

    function listCardForSale(uint256 tokenId, uint256 price, address seller) external {
        listings[tokenId] = Listing(price, seller, true);
        emit CardListed(tokenId, price, seller);
    }

    function buyCard(uint256 tokenId) external payable {
        Listing memory listing = listings[tokenId];
        require(listing.active, "Carte Inexistante");
        require(msg.value == listing.price, "Mauvaise Valeur ETHER");

        nftCollection.transferFrom(listing.seller, msg.sender, tokenId);

        payable(listing.seller).transfer(msg.value);
        listings[tokenId].active = false;

        emit CardSold(tokenId, listing.price, msg.sender, listing.seller);
    }

    function cancelListing(uint256 tokenId) external {
        Listing memory listing = listings[tokenId];
        require(listing.seller == msg.sender, "You are not the seller");
        require(listing.active, "Listing already inactive");

        listings[tokenId].active = false;
    }
}
