import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import CollectionABI from '../src/abis/Collection.json'; // ABI du contrat Collection

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";  // Remplacez par l'adresse de votre contrat déployé

const App: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<any>(null);
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
          const nftContract = new web3.eth.Contract(CollectionABI as any, contractAddress);
          setContract(nftContract);

          // Récupérer le prochain Token ID
          const tokenId = await nftContract.methods.nextTokenId().call();
          setNextTokenId(tokenId);
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
      // Appel de la fonction `mint` avec des paramètres de gas
      await contract.methods.mint(account).send({ from: account, gas: 500000 });
      setStatus(`Carte NFT mintée avec succès pour le compte ${account}!`);
      
      // Mettre à jour le prochain Token ID après le mint
      const tokenId = await contract.methods.nextTokenId().call();
      setNextTokenId(tokenId);
    } catch (error) {
      console.error("Erreur lors du mint : ", error);
      setStatus("Erreur lors du mint.");
    }
  };
  

  return (
    <div>
      <h1>Collection de cartes NFT</h1>
      <p>Compte connecté : {account || "Aucun compte détecté"}</p>
      <p>Prochain Token ID : {nextTokenId !== null ? nextTokenId : "Chargement..."}</p>

      <button onClick={mintNFT} disabled={!account}>
        Minter une carte NFT
      </button>

      <p>Status: {status}</p>
    </div>
  );
};

export default App;
