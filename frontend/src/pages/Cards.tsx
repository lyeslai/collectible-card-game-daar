import React, { useState, useEffect } from 'react';
import { getPokemonSets, getCardsFromSet } from '../../Api/apiService';
import { PokemonCard } from '../../Api/types';

interface CardsProps {
  account: string | null;
  mainContract: any;
}

const Cards: React.FC<CardsProps> = ({ account, mainContract }) => {
  const [cards, setCards] = useState<PokemonCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [collectionName, setCollectionName] = useState<string>("");
  const [status, setStatus] = useState<string>("");

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const sets = await getPokemonSets();
        const cardsFromSet = await getCardsFromSet(sets[0].id);
        setCards(cardsFromSet);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };
    fetchCards();
  }, []);

  const handleMint = async () => {
    if (!mainContract || !account) {
        setStatus("Please connect your wallet and contract.");
        return;
    }
    
    try {
        setStatus("Minting in progress...");
        
        // Assurez-vous que mainContract est correctement initialisé avec le bon ABI
        const createCollectionTx = await mainContract.methods
            .createCollection(
                collectionName, 
                selectedCards.length, 
                "https://api.example.com/metadata/"
            )
            .send({ 
                from: account,
                gas: 500000  // Augmentez le gas limit si nécessaire
            });
            
        // Attendez la confirmation de la transaction
        await createCollectionTx.wait();
        
        const collectionId = await mainContract.methods.collectionCount().call() - 1;
        
        // Mint chaque carte
        for (const cardId of selectedCards) {
            const mintTx = await mainContract.methods
                .mint(collectionId, account)
                .send({
                    from: account,
                    gas: 300000 
                });
            await mintTx.wait();
        }
        console.log("Account:", account);
        console.log("Collection Name:", collectionName);
        console.log("Selected Cards Length:", selectedCards.length);
        
        setStatus("Minting in progress...");
        
        setStatus("Minting complete!");
    } catch (error) {
      console.error("Detailed error:", {
        message: error.message,
        code: error.code,
        data: error.data
    });
    setStatus(`Error during minting: ${error.message}`);
    }
};

  return (
    <div>
      <h1>Mint Your Cards</h1>
      <input
        type="text"
        placeholder="Collection Name"
        value={collectionName}
        onChange={(e) => setCollectionName(e.target.value)}
      />
      <button onClick={handleMint} disabled={!selectedCards.length}>
        Mint {selectedCards.length} Card{selectedCards.length > 1 ? "s" : ""}
      </button>
      <div className="cards-grid">
        {cards.map(card => (
          <div key={card.id} className="card">
            <img src={card.images.small} alt={card.name} />
            <p>{card.name}</p>
            <button onClick={() => setSelectedCards(prev => 
              prev.includes(card.id) ? prev.filter(id => id !== card.id) : [...prev, card.id]
            )}>
              {selectedCards.includes(card.id) ? "Deselect" : "Select"}
            </button>
          </div>
        ))}
      </div>
      {status && <p>{status}</p>}
    </div>
  );
};

export default Cards;
