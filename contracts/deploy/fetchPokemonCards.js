const fs = require('fs');
const axios = require('axios');

async function fetchPokemonData() {
  try {
    // Récupérer les sets
    const setsResponse = await axios.get('https://api.pokemontcg.io/v2/sets');
    const sets = setsResponse.data.data;

    // Récupérer les 400 premières cartes
    const responsePage1 = await axios.get('https://api.pokemontcg.io/v2/cards?pageSize=250&page=1');
    const cardsPage1 = responsePage1.data.data;

    const responsePage2 = await axios.get('https://api.pokemontcg.io/v2/cards?pageSize=150&page=2');
    const cardsPage2 = responsePage2.data.data;

    const allCards = [...cardsPage1, ...cardsPage2];

    // Récupérer les raretés
    const raritiesResponse = await axios.get('https://api.pokemontcg.io/v2/rarities');
    const rarities = raritiesResponse.data.data;

    // Formater les cartes avec leur rareté et leur set
    const formattedCards = allCards.map(card => ({
      name: card.name,
      imageUrl: card.images.large,
      rarity: card.rarity || 'Unknown',  // Certaines cartes peuvent ne pas avoir de rareté
      set: card.set.name,                 // Ajouter le set de la carte
    }));

    // Enregistrer les données dans un fichier JSON
    fs.writeFileSync('pokemonData.json', JSON.stringify({ sets, rarities, cards: formattedCards }, null, 2));
    console.log('Données Pokémon sauvegardées dans pokemonData.json');
  } catch (error) {
    console.error('Erreur lors de la récupération des données Pokémon :', error);
  }
}

// Appel du script
fetchPokemonData();
