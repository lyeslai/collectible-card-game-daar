import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import MainABI from '../abis/Main.json';
import MarketABI from '../abis/Market.json';

const Marketplace = () => {
  const [cards, setCards] = useState([]);
  const [price, setPrice] = useState('');

  useEffect(() => {
    // Charger les cartes listées à la vente
    const fetchCards = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const marketContract = new ethers.Contract('ADRESSE_CONTRACT_MARKET', MarketABI, provider);

      // Récupérer les cartes listées
      const listedCards = await marketContract.getAllListings();
      setCards(listedCards);
    };

    fetchCards();
  }, []);

  const buyCard = async (tokenId: any, cardPrice: string) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const marketContract = new ethers.Contract('ADRESSE_CONTRACT_MARKET', MarketABI, signer);

    const tx = await marketContract.buyCard(tokenId, { value: ethers.utils.parseEther(cardPrice) });
    await tx.wait();
    alert('Carte achetée avec succès !');
  };

  const listCardForSale = async (tokenId: any) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const mainContract = new ethers.Contract('ADRESSE_CONTRACT_MAIN', MainABI, signer);

    const tx = await mainContract.listCardOnMarket(tokenId, ethers.utils.parseEther(price));
    await tx.wait();
    alert('Carte listée avec succès !');
  };

  return (
    <div>
      <h1>Marketplace</h1>
      <ul>
        {cards.map((card, index) => (
          <li key={index}>
            Carte ID: {card.tokenId} - Prix: {ethers.utils.formatEther(card.price)}
            <button onClick={() => buyCard(card.tokenId, card.price)}>Acheter</button>
          </li>
        ))}
      </ul>

      <h2>Lister une carte à vendre</h2>
      <input
        type="number"
        placeholder="ID de la carte"
        onChange={(e) => setPrice(e.target.value)}
      />
      <button onClick={() => listCardForSale(cardId)}>Lister la carte</button>
    </div>
  );
};

export default Marketplace;
