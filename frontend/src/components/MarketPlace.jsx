import pokemon from 'pokemontcgsdk'
import React, { useState, useEffect } from 'react';
import { getMarketPlaceCards, getUserCards, buyFromMarketplace } from '@/functions/functions';
import backgroundImage from './emerald.jpg'; 
import './MarketPlace.css';
import { Checkbox } from '@mui/material';



const MarketPlace = ({ wallet }) => {
  const [MarketPlaceCards, setMarketPlaceCards] = useState(null)
  const [MarketPlaceMap, setMarketPlaceMap] = useState(null)
  const [SpotMap, setSpotMap] = useState(null)
  const [userCards, setUserCards] = useState([]);

  useEffect(() => {
    async function fetchMarketPlaceCards() {
      try {
        const cards = await getMarketPlaceCards(wallet);
        const cardList = await Promise.all(cards.map(c => pokemon.card.find(c.uri)));
        setMarketPlaceCards(cardList);
        
        const cardsMap = new Map();
        const spotsMap = new Map();
        
        for (const card of cards) {
          const currencyCards = await Promise.all(card.acceptedCurrencies.map(uri => pokemon.card.find(uri)));
          cardsMap.set(card.uri, currencyCards);
          spotsMap.set(card.uri, card);
        }
        
        setMarketPlaceMap(cardsMap);
        setSpotMap(spotsMap);
      } catch (error) {
        console.error("Error fetching market cards:", error);
      }
    }
  
    fetchMarketPlaceCards();
  }, [wallet]);


  useEffect(() => {
    async function fetchUserCards() {
      try {
        const cards = await getUserCards(wallet);
        const cardList = await Promise.all(cards.map(c => pokemon.card.find(c)));
        setUserCards(cardList);
      } catch (error) {
        console.error("Error fetching user cards:", error);
      }
    }
  
    fetchUserCards();
  }, [wallet]);  

  function hasCard(id) {
    return UserCards.includes(id)
  }
  const [selectedCard, setSelectedCard] = useState(null);
  const openPopup = (card) => {
    setSelectedCard(card);
  };

  const closePopup = () => {
    setSelectedCard(null);
  };

  const [selectedCards, setSelectedCards] = useState([]);

  const handleCardSelect = (cardId) => {
    if (selectedCards.length < 1) {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  const handleCardDeselect = (cardId) => {
    setSelectedCards(selectedCards.filter((id) => id !== cardId));
  };
  const handleExchange = async () => {
    if (!selectedCard || selectedCards.length !== 1) {
      alert("Please select one card to exchange.");
      return;
    }
  
    const spot = SpotMap.get(selectedCard.id);
    const currency = selectedCards[0];
  
    if (!spot || !currency) {
      alert("Error: Invalid selection for exchange.");
      return;
    }
  
    try {
      await buyFromMarketplace(wallet, spot, currency);
      alert("Exchange successful!");
      closePopup();
      // Refresh marketplace and user cards
      fetchMarketPlaceCards();
      fetchUserCards();
    } catch (error) {
      console.error("Error during exchange:", error);
      alert("Exchange failed. Please try again.");
    }
  };
  

  return (
    <div className="profile-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
    <div className="page-wrapper">
      <h1 className="title">MarketPlace</h1>
      <div className="grid-container" id="MyPokemonCards">
        {MarketPlaceCards !== null ? (
          MarketPlaceCards.map((card, index) => (
            <div key={index} className="card-container" onClick={() => { console.log("Selected : ", card); openPopup(card) }}>
              <img src={card.images.small} alt={card.name} />
            </div>
          ))
        ) : (
          <p>No cards in the marketplace.</p>
        )}
      </div>
      {selectedCard && (
  <div className="popup-overlay">
    <div className="popupMarketPlace">
      <button className="close-button-marketplace" onClick={closePopup}>Close</button>
      <img className="Marketplace-popupImg" src={selectedCard.images.small} alt={selectedCard.name} />
      <div className="acceptedCards">
        <h2>Your Cards for Exchange</h2>
        <div className="grid-container-marketplace">
          {userCards.map((card, index) => (
            <div key={index} className="card-container-marketplace">
              <img className="AcceptedCard-img" src={card.images.small} alt={card.name} />
              <Checkbox
                checked={selectedCards.includes(card.id)}
                onChange={() => selectedCards.includes(card.id) 
                  ? handleCardDeselect(card.id) 
                  : handleCardSelect(card.id)}
              />
            </div>
          ))}
        </div>
      </div>
      <button 
        className='exchange' 
        variant="contained"
        disabled={selectedCards.length !== 1}
        onClick={handleExchange}
      >
        Exchange card
      </button>
    </div>
  </div>
)}

    </div>
    </div>



  )
}

export default MarketPlace