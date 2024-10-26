// src/API/apiService.ts
import axios from 'axios';
import { API_URL, API_KEY } from './apiConfig';
import { PokemonSet, PokemonCard } from './types';

// Fonction pour récupérer tous les sets de cartes Pokémon
export async function getPokemonSets(): Promise<PokemonSet[]> {
  try {
    const response = await axios.get<{ data: PokemonSet[] }>(`${API_URL}sets`, {
      headers: {
        'X-Api-Key': API_KEY,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des sets:', error);
    throw error;
  }
}

// Fonction pour récupérer les cartes d'un set spécifique
export async function getCardsFromSet(setId: string): Promise<PokemonCard[]> {
  try {
    const response = await axios.get<{ data: PokemonCard[] }>(
      `${API_URL}cards?q=set.id:${setId}`,
      {
        headers: {
          'X-Api-Key': API_KEY,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des cartes du set ${setId}:`, error);
    throw error;
  }
}

// Fonction pour créer un booster de 5 cartes aléatoires
export async function createBooster(): Promise<{ boosterId: string, cards: PokemonCard[] }> {
  try {
    // Récupérer tous les sets de cartes disponibles
    const setsResponse = await axios.get<{ data: PokemonSet[] }>(`${API_URL}sets`, {
      headers: { 'X-Api-Key': API_KEY },
    });
    const sets = setsResponse.data.data;

    // Choisir un set au hasard
    const randomSetId = sets[Math.floor(Math.random() * sets.length)].id;
    const cardsResponse = await axios.get<{ data: PokemonCard[] }>(
      `${API_URL}cards?q=set.id:${randomSetId}`,
      { headers: { 'X-Api-Key': API_KEY } }
    );
    const allCards = cardsResponse.data.data;

    // Mélanger les cartes et en sélectionner 5 aléatoirement
    const selectedCards = allCards
      .sort(() => 0.5 - Math.random())  // Mélange aléatoire
      .slice(0, 5);  // Prendre les 5 premières cartes après le mélange

    // Générer un identifiant unique pour le booster
    const boosterId = `booster_${Date.now()}`;

    // Retourner le booster
    return { boosterId, cards: selectedCards };
  } catch (error) {
    console.error('Erreur lors de la création du booster:', error);
    throw error;
  }
}


  
