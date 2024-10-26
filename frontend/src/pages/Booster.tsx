// Booster.tsx

import React, { useState } from 'react';
import { createBooster } from '../../Api/apiService';
import { PokemonCard } from '../../Api/types';

interface BoosterProps {
  mainContract: any;
  account: string | null;
}

const Booster: React.FC<BoosterProps> = ({ mainContract, account }) => {
  const [booster, setBooster] = useState<{ boosterId: string; cards: PokemonCard[] } | null>(null);
  const [status, setStatus] = useState<string>("");

  const handleCreateAndMintBooster = async () => {
    if (!mainContract || !account) {
      setStatus("Please connect your wallet and contract.");
      return;
    }
  
    try {
      setStatus("Creating booster...");
  
      // Étape 1 : Créer un booster avec 5 cartes aléatoires
      const newBooster = await createBooster();
      setBooster(newBooster);
  
      // Extraire les cardIds en transformant en entier si possible
      const cardIds = newBooster.cards.map(card => {
        // Extraire seulement la partie numérique
        const numericId = card.id.match(/\d+/g);
        return numericId ? parseInt(numericId.join(""), 10) : NaN;
      }).filter(id => !isNaN(id));  // Filtrer les valeurs NaN
  
      if (cardIds.length !== 5) {
        setStatus("Error: Unable to create booster with selected cards.");
        return;
      }
  
      console.log("Card IDs for minting:", cardIds);
  
      // Étape 2 : Minter le booster sur la blockchain
      setStatus("Minting booster on the blockchain...");
      await mainContract.methods.createBooster(cardIds).send({ from: account });
  
      setStatus("Booster created and minted successfully!");
    } catch (error) {
      console.error("Error creating and minting booster:", error);
      setStatus(`Error: ${error.message}`);
    }
  };
  
  return (
    <div>
      <h1>Create and Mint Booster</h1>
      <button onClick={handleCreateAndMintBooster}>Create and Mint Random Booster</button>
      {status && <p>{status}</p>}

      {booster && (
        <div>
          <h2>Booster ID: {booster.boosterId}</h2>
          <h3>Selected Cards</h3>
          <ul>
            {booster.cards.map((card) => (
              <li key={card.id}>
                <p>{card.name}</p>
                <img src={card.images.small} alt={card.name} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Booster;
