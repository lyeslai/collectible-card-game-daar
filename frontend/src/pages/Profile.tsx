import React, { useEffect, useState } from 'react';
  // Assure-toi d'avoir un fichier CSS pour styliser le composant

interface Card {
  name: string;
  imageUrl: string;
  rarity: string;
  set: string;
}

const Profile: React.FC = () => {
  const [ownedCards, setOwnedCards] = useState<Card[]>([]);

  // Simuler la récupération des cartes possédées par l'utilisateur
  useEffect(() => {
    const fetchOwnedCards = async () => {
      const cards: Card[] = [
        {
          name: "Pikachu",
          imageUrl: "https://images.pokemontcg.io/base1/58_hires.png",
          rarity: "Common",
          set: "Base Set",
        },
        {
          name: "Charizard",
          imageUrl: "https://images.pokemontcg.io/base1/4_hires.png",
          rarity: "Rare",
          set: "Base Set",
        },
      ];
      setOwnedCards(cards);
    };

    fetchOwnedCards();
  }, []);

  return (
    <div className="profile-container">
      <h1>Your Collection</h1>
      <div className="grid-container">
        {ownedCards.map((card, index) => (
          <div key={index} className="grid-item">
            <img src={card.imageUrl} alt={card.name} className="card-image" />
            <div className="card-info">
              <h3>{card.name}</h3>
              <p>Rarity: {card.rarity}</p>
              <p>Set: {card.set}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
