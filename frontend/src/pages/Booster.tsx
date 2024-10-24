// src/pages/Booster.tsx

import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { createBooster } from '../../Api/apiService'; // Fonction API pour générer un booster
import { PokemonCard } from '../../Api/types';
import Navbar from '../components/navbar';
import './Booster.css';

const Booster: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [boosterId, setBoosterId] = useState<string | null>(null);
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [status, setStatus] = useState<string>("");
  const [contract, setContract] = useState<any>(null);
  
  const contractAddress = "YOUR_CONTRACT_ADDRESS";
  const contractABI = []; // ABI de votre contrat

  useEffect(() => {
    const initBlockchain = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
          const contractInstance = new web3.eth.Contract(contractABI, contractAddress);
          setContract(contractInstance);
        } catch (error) {
          console.error("Erreur lors de l'initialisation blockchain:", error);
        }
      } else {
        setStatus("Veuillez installer MetaMask.");
      }
    };

    initBlockchain();
  }, []);

  // Créer et minter un booster
  const handleCreateBooster = async () => {
    try {
      const { boosterId, cards } = await createBooster(); // Crée un booster hors ligne
      setBoosterId(boosterId);
      setCards(cards);

      // Mint le booster sur la blockchain
      const cardIds = cards.map(card => card.id);
      await contract.methods.mintBooster(account, cardIds).send({ from: account });
      setStatus(`Booster ${boosterId} minté avec succès.`);
    } catch (error) {
      console.error("Erreur lors de la création du booster:", error);
      setStatus("Erreur lors de la création du booster.");
    }
  };

  return (
    <div className="booster-page">
      <Navbar />
      <main className="booster-container">
        <h1>Créer un Booster</h1>
        <button onClick={handleCreateBooster}>Créer un booster</button>
        {boosterId && (
          <>
            <h2>Booster ID: {boosterId}</h2>
            <div className="cards-grid">
              {cards.map((card) => (
                <div key={card.id} className="card">
                  <img src={card.images.small} alt={`Card ${card.name}`} />
                  <p>{card.name}</p>
                </div>
              ))}
            </div>
          </>
        )}
        <p>{status}</p>
      </main>
    </div>
  );
};

export default Booster;
