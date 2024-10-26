import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Web3 from 'web3';
import Home from './pages/Home';
import Cards from './pages/Cards';
import Profile from './pages/Profile';

import MainABI from './contracts.json';

const contractAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707";



const App = () => {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [mainContract, setMainContract] = useState<any>(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          const web3Instance = new Web3(window.ethereum);
          const accounts = await web3Instance.eth.requestAccounts();
          setAccount(accounts[0]);

          const contractInstance = new web3Instance.eth.Contract(MainABI.contracts.Main.abi as any, contractAddress);
          setMainContract(contractInstance);
          setWeb3(web3Instance);
        } catch (error) {
          console.error("Error initializing Web3 or contract:", error);
        }
      } else {
        console.error("Please install MetaMask.");
      }
    };
    initWeb3();
  }, []);

  return (
    <Router>
      <Routes>s
        <Route path="/" element={<Home />} />
        <Route path="/cards" element={<Cards account={account} mainContract={mainContract} />} />
        <Route path="/profile" element={<Profile account={account} mainContract={mainContract} web3={web3} />} />
      </Routes>
    </Router>
  );
};

export default App;
