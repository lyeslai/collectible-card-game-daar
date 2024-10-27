import React, { useEffect, useState } from 'react';
import './Home.css';
import { Link } from 'react-router-dom';
import backgroundImage from './bg-pokemon.jpg';

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [pokemonData, setPokemonData] = useState([]);

  useEffect(() => {
    async function enableEthereum() {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (err) {
        if (err.code === 4001) {
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      }
    }

    async function getAccount() {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      setCurrentAccount(account);
    }

    async function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
      } else if (accounts[0] !== currentAccount) {
        setCurrentAccount(accounts[0]);
      }
    }

    enableEthereum();
    getAccount();

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.request({ method: 'eth_accounts' }).then(handleAccountsChanged);
  }, [currentAccount]);

  useEffect(() => {
    function loadPokemonCards() {
      fetch('pokemon_data.json')
        .then((response) => response.json())
        .then((data) => {
          setPokemonData(data);
        })
        .catch((error) => {
          console.error('Erreur :', error);
        });
    }

    loadPokemonCards();
  }, []);

  return (
    <>
      <div className="headline" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <h1>Pokemon Cards NFTs</h1>

      </div>
      
      <div className="account-wrapper">
        <h2>Account Information</h2>
        <div className="account-info">
          <p>Account Address:</p>
          <span className="showAccount">{currentAccount || 'Not Connected'}</span>
        </div>
      </div>

      <div className="grid-container" id="pokemonCards">
        {pokemonData.map((card, index) => (
          <div key={index} className="card-container">
            <img src={card.images.small} alt="Pokemon Card" />
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
