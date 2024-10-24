import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Web3 from 'web3';
import Home from './pages/Home';

import Cartes from './pages/Cards';
import CollectionABI from '../../contracts/artifacts/src/Collection.sol/Collection.json'; // ABI du contrat Collection

const contractAddress = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";  // Adresse de votre contrat Collection déployé

const App = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [nextTokenId, setNextTokenId] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          // Demande d'accès au compte
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await web3Instance.eth.getAccounts();
          setAccount(accounts[0]);

          // Création de l'instance du contrat
          const contractInstance = new web3Instance.eth.Contract(CollectionABI.abi, contractAddress);
          setContract(contractInstance);

          // Récupération du nextTokenId
          const tokenId = await contractInstance.methods.nextTokenId().call();
          setNextTokenId(tokenId);
        } catch (error) {
          console.error("Erreur d'initialisation :", error);
        }
      } else {
        console.log("Veuillez installer MetaMask!");
      }
    };

    init();
  }, []);

  const mintNFT = async () => {
    if (!contract || !account) return;

    try {
      console.log("Tentative de mint pour le compte :", account);
      const result = await contract.methods.mint(account).send({ from: account });
      console.log("Résultat du mint :", result);

      // Mise à jour du nextTokenId après le mint
      const newTokenId = await contract.methods.nextTokenId().call();
      setNextTokenId(newTokenId);
    } catch (error) {
      console.error("Erreur lors du mint :", error);
    }
  };

  return (
<Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cartes" element={<Cartes />} />
      </Routes>
    </Router>

  );
};

export default App;
