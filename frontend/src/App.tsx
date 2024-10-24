import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import CollectionABI from './abis/Collection.json';
import BoosterABI from './abis/Booster.json';
import MainABI from './abis/Main.json';

const collectionAddress = "TON_ADRESSE_CONTRAT_COLLECTION";
const boosterAddress = "TON_ADRESSE_CONTRAT_BOOSTER";
const mainAddress = "TON_ADRESSE_CONTRAT_MAIN";

function App() {
  const [account, setAccount] = useState("");
  const [web3, setWeb3] = useState(null);
  const [collectionContract, setCollectionContract] = useState(null);
  const [boosterContract, setBoosterContract] = useState(null);
  const [mainContract, setMainContract] = useState(null);

  useEffect(() => {
    // Connexion à Metamask et récupération du compte utilisateur
    const loadWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        // Connexion aux contrats
        const collection = new web3Instance.eth.Contract(CollectionABI, collectionAddress);
        const booster = new web3Instance.eth.Contract(BoosterABI, boosterAddress);
        const main = new web3Instance.eth.Contract(MainABI, mainAddress);

        setCollectionContract(collection);
        setBoosterContract(booster);
        setMainContract(main);
      } else {
        alert("Please install Metamask!");
      }
    };

    loadWeb3();
  }, []);

  const buyCard = async (cardId) => {
    if (collectionContract && account) {
      const cardPrice = Web3.utils.toWei('0.01', 'ether'); // Le prix de la carte en wei
      await collectionContract.methods.buyCard(cardId).send({ from: account, value: cardPrice });
      alert('Carte achetée avec succès !');
    }
  };

  const openBooster = async () => {
    if (boosterContract && account) {
      await boosterContract.methods.openBooster().send({ from: account });
      alert('Booster ouvert avec succès !');
    }
  };

  return (
    <div>
      <h1>Collectible Card Game</h1>
      <p>Compte connecté : {account}</p>
      <button onClick={() => buyCard(0)}>Acheter la carte 0</button>
      <button onClick={openBooster}>Ouvrir un booster</button>
    </div>
  );
}

export default App;
