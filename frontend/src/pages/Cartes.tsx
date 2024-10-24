import React, { useEffect, useState } from 'react';

// Typage pour les cartes
interface Card {
  id: string;
  name: string;
  imageUrl: string;
  rarity: string;
  set: string;
}

const Cartes: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Chargement des cartes à partir du fichier JSON
    const fetchCardsFromJson = async () => {
      try {
        const response = await fetch('../contracts/deploy/cards.json'); // Remplace par le bon chemin vers cards.json
        const data = await response.json();
        setCards(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading cards from JSON:', error);
        setLoading(false);
      }
    };

    fetchCardsFromJson();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Liste des cartes Pokémon</h1>
      <div className="cards-grid">
        {cards.map((card) => (
          <div key={card.id} className="card">
            <img src={card.imageUrl} alt={card.name} />
            <h2>{card.name}</h2>
            <p><strong>Rarity:</strong> {card.rarity}</p>
            <p><strong>Set:</strong> {card.set}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cartes;
