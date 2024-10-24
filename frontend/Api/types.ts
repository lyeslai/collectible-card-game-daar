// src/API/types.ts
export interface PokemonSet {
    id: string;
    name: string;
    series: string;
    printedTotal: number;
    total: number;
    releaseDate: string;
    images: {
      symbol: string;
      logo: string;
    };
  }
  
  export interface PokemonCard {
    id: string;
    name: string;
    rarity: string;
    images: {
      small: string;
      large: string;
    };
  }
  
  export interface WalletProps {
    wallet: {
      details: any;  // Vous pouvez ajuster ces types selon vos besoins
      contract: any;
    };
  }
  
  export interface Card {
    num: string;
    img: string;
  }
  