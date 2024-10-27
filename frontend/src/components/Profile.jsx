import React, { useState, useEffect } from 'react';
import './profile.css';
import Popup from './Popup';
import backgroundImage from './anime-art-fon-tekstura-pokemon.jpg'; // Importer l'image de fond
import { getUserCards } from '../functions/functions';
import pokemon from 'pokemontcgsdk';

const Profile = ({ wallet }) => {
  const [myCards, setMyCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [cardPopups, setCardPopups] = useState([]);

  useEffect(() => {
    async function fetchUserCards() {
      const cards = await getUserCards(wallet);
      const cardPromises = cards.map((cardId) =>
        pokemon.card.find(cardId).then((card) => card)
      );

      Promise.all(cardPromises)
        .then((userCards) => {
          setMyCards(userCards);
          setCardPopups(userCards.map(() => false)); // Initialiser les états des popups
        })
        .catch((error) => {
          console.error('Error fetching user cards:', error);
        });
    }

    fetchUserCards();
  }, [wallet]);

  const showPopup = (cardIndex) => {
    setSelectedCard(myCards[cardIndex]);
    const newCardPopups = [...cardPopups];
    newCardPopups[cardIndex] = true;
    setCardPopups(newCardPopups);
  };

  const hidePopup = () => {
    setSelectedCard(null);
    setCardPopups(cardPopups.map(() => false));
  };

  return (
    <div className="profile-wrapper" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <h1 className="title">My Cards</h1>
      <div className="grid-container" id="MyPokemonCards">
        {myCards.map((card, index) => (
          <div key={index} className="card-container">
            <img src={card.images.small} alt="Pokemon Card" onClick={() => showPopup(index)} />
            <Popup isVisible={cardPopups[index]} onClose={hidePopup} card={card} wallet={wallet}>
              {/* Additional content for the popup */}
            </Popup>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
