// src/Components/NFTList.tsx
import React, { useEffect, useState } from 'react';

interface NFTListProps {
  contract: any | null; // Typage pour Web3.js
  currentAccount: string | null;
}

const NFTList: React.FC<NFTListProps> = ({ contract, currentAccount }) => {
  const [nfts, setNfts] = useState<string[]>([]);

  const fetchNFTs = async () => {
    if (contract && currentAccount) {
      try {
        const cards: string[] = await contract.methods.userCards().call({ from: currentAccount });
        setNfts(cards);
      } catch (error) {
        console.error("Erreur lors de la récupération des NFTs:", error);
      }
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [contract, currentAccount]);

  return (
    <div>
      <h3>Vos cartes</h3>
      <ul>
        {nfts.map((nft, index) => (
          <li key={index}>{nft}</li>
        ))}
      </ul>
    </div>
  );
};

export default NFTList;
