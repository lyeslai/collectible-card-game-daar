import React, { useState } from 'react';
import { ethers } from 'ethers';
import MainABI from '../abis/Main.json';  // Assure-toi que tu as l'ABI de ton contrat Main

const Booster = () => {
  const [cards, setCards] = useState([]);

  const buyBooster = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const mainContract = new ethers.Contract('ADRESSE_CONTRACT_MAIN', MainABI, signer);

    const tx = await mainContract.buyBooster(1);  // Acheter 1 booster
    await tx.wait();
    alert('Booster acheté avec succès !');
  };

  const openBooster = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const mainContract = new ethers.Contract('ADRESSE_CONTRACT_MAIN', MainABI, signer);

    const tx = await mainContract.openBooster();
    await tx.wait();
    alert('Booster ouvert avec succès !');

    // Écouter l'événement et récupérer les cartes du booster ouvert
    mainContract.on('BoosterOpened', (user, boosterCards) => {
      setCards(boosterCards);  // Mettre à jour la liste des cartes reçues
    });
  };

  return (
    <div>
      <h1>Ouvrir un booster</h1>
      <button onClick={buyBooster}>Acheter un booster</button>
      <button onClick={openBooster}>Ouvrir un booster</button>
      <h2>Cartes reçues :</h2>
      <ul>
        {cards.map((card, index) => (
          <li key={index}>{card}</li>
        ))}
      </ul>
    </div>
  );
};

export default Booster;
