import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import CollectionABI from './abis/Collection.json'; // ABI du contrat Collection
import pokemonData from '/home/lyeslai/Documents/collectible-card-game-daar/pokemonData.json'; // Données des cartes

const collectionAddress = "ADRESSE_CONTRAT_COLLECTION"; // Adresse du contrat déployé

function App() {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [collectionContract, setCollectionContract] = useState(null);
  const [userCards, setUserCards] = useState([]); // Cartes possédées par l'utilisateur

  // Connexion à Metamask et configuration du contrat
  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        // Connexion au contrat Collection
        const collection = new web3Instance.eth.Contract(CollectionABI, collectionAddress);
        setCollectionContract(collection);
      } else {
        alert('Please install Metamask!');
      }
    };

    loadWeb3();
  }, []);

  // Fonction pour acheter une carte
  const buyCard = async (cardId) => {
    if (collectionContract && account) {
      const cardPrice = Web3.utils.toWei('0.01', 'ether'); // Prix de la carte en wei
      try {
        await collectionContract.methods.buyCard(cardId).send({ from: account, value: cardPrice });
        alert('Carte achetée avec succès !');
        loadUserCards(); // Recharger les cartes après l'achat
      } catch (err) {
        console.error('Erreur lors de l\'achat de la carte :', err);
      }
    }
  };

  // Fonction pour charger les cartes de l'utilisateur
  const loadUserCards = async () => {
    if (collectionContract && account) {
      try {
        const cards = await collectionContract.methods.getUserCards().call({ from: account });
        setUserCards(cards);
      } catch (err) {
        console.error('Erreur lors de la récupération des cartes de l\'utilisateur :', err);
      }
    }
  };

  // Charger les cartes dès que le compte est connecté
  useEffect(() => {
    if (account && collectionContract) {
      loadUserCards();
    }
  }, [account, collectionContract]);

  return (
    <div>
      <h1>Collectible Pokémon Card Game</h1>
      <p>Compte connecté : {account}</p>

      {/* Affichage des cartes disponibles */}
      <h2>Cartes disponibles à l'achat</h2>
      <div className="cards-grid">
        {pokemonData.cards.map((card, index) => (
          <div key={index} className="card">
            <img src={card.imageUrl} alt={card.name} />
            <p><strong>{card.name}</strong></p>
            <p>Rareté : {card.rarity}</p>
            <p>Set : {card.set}</p>
            <button onClick={() => buyCard(index)}>Acheter cette carte</button>
          </div>
        ))}
      </div>

      {/* Affichage des cartes possédées */}
      <h2>Mes cartes</h2>
      <div className="cards-grid">
        {userCards.map((card, index) => (
          <div key={index} className="card">
            <img src={card} alt={`Card ${index}`} />
            <p>Carte {index + 1}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
