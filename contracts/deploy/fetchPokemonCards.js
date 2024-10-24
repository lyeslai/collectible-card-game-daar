const fs = require('fs');
const fetch = require('node-fetch');

const API_KEY = '37d24476-fdb3-45bf-9341-120688ac3d22'; // Remplace par ta clé API Pokémon TCG
const API_URL = 'https://api.pokemontcg.io/v2/cards?limit=400'; // Récupère les 400 premières cartes

async function fetchPokemonCards() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'X-Api-Key': API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Extraire seulement les informations nécessaires (nom, image, set, rareté)
    const cards = data.data.map((card) => ({
      id: card.id,
      name: card.name,
      imageUrl: card.images?.small, // Assure-toi que l'image est présente
      rarity: card.rarity || 'Unknown', // Si la rareté n'est pas définie, utilise 'Unknown'
      set: card.set?.name || 'Unknown', // Nom du set (ou 'Unknown' si absent)
    }));

    // Sauvegarde les cartes dans un fichier JSON
    fs.writeFileSync('cards.json', JSON.stringify(cards, null, 2), 'utf-8');
    console.log('Cartes récupérées et stockées dans cards.json');
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes :', error);
  }
}

fetchPokemonCards();
