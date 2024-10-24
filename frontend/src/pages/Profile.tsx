// src/pages/Profile.tsx

import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Navbar from '../components/navbar';
import CollectionData from '../contracts.json';  // ABI du contrat Collection
import './Profile.css';

const contractAddress = CollectionData.contracts.Main.address; // Accès à l'adresse du contrat
const contractABI = CollectionData.contracts.Main.abi; // ABI du contrat

const Profile: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [mintedCards, setMintedCards] = useState<any[]>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        try {
          // Demande d'accès à MetaMask
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          setAccount(accounts[0]);

          // Créer une instance du contrat avec l'ABI et l'adresse du contrat
          const nftContract = new web3.eth.Contract(contractABI as any, contractAddress);

          // Récupérer toutes les cartes appartenant à l'utilisateur
          const totalSupply = await nftContract.methods.nextTokenId().call();
          const ownedCards = [];

          for (let i = 0; i < totalSupply; i++) {
            const owner = await nftContract.methods.ownerOf(i).call();
            if (owner.toLowerCase() === accounts[0].toLowerCase()) {
              const cardURI = await nftContract.methods.tokenURI(i).call();
              ownedCards.push({ id: i, uri: cardURI });
            }
          }

          setMintedCards(ownedCards);
        } catch (error) {
          console.error("Erreur lors de la récupération des données blockchain:", error);
          setStatus("Erreur lors de la récupération des cartes mintées.");
        }
      } else {
        console.error("MetaMask non détecté.");
        setStatus("MetaMask non détecté.");
      }
    };

    loadBlockchainData();
  }, []);

  return (
    <div className="profile-page">
      <Navbar />
      <main className="profile-container">
        <h1>Profil</h1>
        <p>Compte : {account}</p>
        <h2>Cartes mintées</h2>
        <div className="cards-grid">
          {mintedCards.length > 0 ? (
            mintedCards.map((card) => (
              <div key={card.id} className="card">
                <img src={card.uri} alt={`Card ${card.id}`} />
                <p>Carte ID : {card.id}</p>
              </div>
            ))
          ) : (
            <p>Aucune carte mintée pour l'instant.</p>
          )}
        </div>
        <p>{status}</p>
      </main>
    </div>
  );
};

export default Profile;
