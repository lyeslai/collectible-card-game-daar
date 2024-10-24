import React, { useEffect, useState } from 'react';
import { getPokemonSets, getCardsFromSet } from '../../Api/apiService';
import { PokemonCard } from '../../Api/types';
import Navbar from '../components/navbar';
import './Cards.css';

const Cartes: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    // Récupérer toutes les cartes du set Pokémon
    const loadPokemonCards = async () => {
      try {
        const sets = await getPokemonSets();
        if (sets.length > 0) {
          // On récupère les cartes du premier set pour l'exemple
          const cardsFromSet = await getCardsFromSet(sets[0].id);
          setCards(cardsFromSet);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des cartes:', error);
      }
    };

    loadPokemonCards();
  }, []);

  // Fonction pour sélectionner une carte à minter
  const handleSelectCard = (cardId: string) => {
    if (selectedCards.includes(cardId)) {
      setSelectedCards(selectedCards.filter(id => id !== cardId));
    } else {
      setSelectedCards([...selectedCards, cardId]);
    }
  };

  // Fonction pour minter une ou plusieurs cartes
  const mintSelectedCards = async () => {
    if (!account) {
      setStatus('Compte non connecté');
      return;
    }

    try {
      // Logique pour minter les cartes sélectionnées
      console.log('Cartes sélectionnées pour mint:', selectedCards);
      setStatus(`Minting ${selectedCards.length} cartes pour le compte ${account}...`);
      // Logique pour envoyer les cartes au contrat
      setSelectedCards([]);  // Réinitialiser après le mint
      setStatus('Cartes mintées avec succès !');
    } catch (error) {
      console.error('Erreur lors du mint :', error);
      setStatus('Erreur lors du mint.');
    }
  };

  return (
    <div className="cartes-page">
      <Navbar />

      <main className="cartes-container">
        <h1>Cartes Pokémon</h1>
        <div className="mint-section">
          {selectedCards.length > 0 && (
            <button onClick={mintSelectedCards} className="mint-button">
              Minter {selectedCards.length} Carte{selectedCards.length > 1 ? 's' : ''}
            </button>
          )}
          <p>{status}</p>
        </div>
        <div className="cards-grid">
          {cards.length > 0 ? (
            cards.map((card) => (
              <div key={card.id} className="card">
                <img src={card.images.small} alt={`Card ${card.name}`} />
                <p>{card.name}</p>
                <button
                  className={`select-button ${selectedCards.includes(card.id) ? 'selected' : ''}`}
                  onClick={() => handleSelectCard(card.id)}
                >
                  {selectedCards.includes(card.id) ? 'Désélectionner' : 'Sélectionner'}
                </button>
              </div>
            ))
          ) : (
            <p>Aucune carte disponible.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cartes;
