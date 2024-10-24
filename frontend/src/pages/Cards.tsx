// src/pages/Cartes.tsx

import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import Navbar from '../components/navbar';
import CollectionABI from '../../../contracts/artifacts/src/Collection.sol/Collection.json'; // ABI du contrat Collection
import './Cards.css';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // Adresse du contrat

const Cartes: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [nextTokenId, setNextTokenId] = useState<number | null>(null);
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
          const nftContract = new web3.eth.Contract(CollectionABI.abi as any, contractAddress);
          setContract(nftContract);

          // Récupérer toutes les cartes mintées
          const totalSupply = await nftContract.methods.nextTokenId().call();
          setNextTokenId(totalSupply);

          const cardArray = [];
          for (let i = 0; i < totalSupply; i++) {
            const cardURI = await nftContract.methods.tokenURI(i).call();
            cardArray.push({ id: i, uri: cardURI });
          }
          setCards(cardArray);
        } catch (error) {
          console.error("Erreur lors de la récupération des données blockchain:", error);
        }
      } else {
        console.error("MetaMask non détecté.");
        setStatus("MetaMask n'est pas détecté");
      }
    };

    loadBlockchainData();
  }, []);

  // Fonction pour minter un NFT
  const mintNFT = async () => {
    if (!contract || !account) {
      setStatus("Contrat ou compte non disponible.");
      return;
    }

    try {
      await contract.methods.mint(account).send({ from: account, gas: 500000 });
      setStatus(`Carte NFT mintée avec succès pour le compte ${account}!`);

      // Mettre à jour après le mint
      const newTokenId = await contract.methods.nextTokenId().call();
      setNextTokenId(newTokenId);

      // Ajouter la nouvelle carte mintée
      const newCardURI = await contract.methods.tokenURI(newTokenId - 1).call();
      setCards([...cards, { id: newTokenId - 1, uri: newCardURI }]);
    } catch (error) {
      console.error("Erreur lors du mint : ", error);
      setStatus("Erreur lors du mint.");
    }
  };

  return (
    <div className="cartes-page">
      <Navbar />
      <main className="cartes-container">
        <h1>Mes Cartes</h1>
        <div className="cards-grid">
          {cards.length > 0 ? (
            cards.map((card, index) => (
              <div key={index} className="card">
                <img src={card.uri} alt={`Card ${card.id}`} />
                <p>Carte ID : {card.id}</p>
              </div>
            ))
          ) : (
            <p>Aucune carte mintée pour l'instant.</p>
          )}
        </div>
        <button onClick={mintNFT} className="mint-button">
          Minter une nouvelle carte
        </button>
        <p>{status}</p>
      </main>
    </div>
  );
};

export default Cartes;
