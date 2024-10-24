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

export async function createBooster(): Promise<{ boosterId: string, cards: PokemonCard[] }> {
    try {
      // Récupérer un set aléatoire de cartes pour le booster
      const setsResponse = await axios.get(`${API_URL}sets`, { headers: { 'X-Api-Key': API_KEY } });
      const sets = setsResponse.data.data;
  
      // Sélectionner un set au hasard pour créer le booster
      const randomSetId = sets[Math.floor(Math.random() * sets.length)].id;
      const cardsResponse = await axios.get(`${API_URL}cards?q=set.id:${randomSetId}`, { headers: { 'X-Api-Key': API_KEY } });
      const cards = cardsResponse.data.data.slice(0, 5);  // Choisir 5 cartes aléatoires pour le booster
  
      // Générer un booster avec un identifiant unique
      const boosterId = 'booster_' + Date.now();
  
      // Simuler la génération du booster (id + cartes) et les stocker
      // Vous pouvez stocker cela dans une base de données ou une mémoire cache
      return { boosterId, cards };
    } catch (error) {
      console.error('Erreur lors de la création du booster:', error);
      throw error;
    }
  }
  
