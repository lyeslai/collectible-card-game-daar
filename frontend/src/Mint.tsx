// src/Components/Mint.tsx
import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';


interface MintProps {
  contract: any | null; // Utilisation de `any` pour Web3.js
  currentAccount: string | null;
}

const Mint: React.FC<MintProps> = ({ contract, currentAccount }) => {
  const [mintUri, setMintUri] = useState<string>('');

  const mintNFT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contract && currentAccount) {
      try {
        await contract.methods.safeMint(currentAccount, mintUri).send({ from: currentAccount });
        alert('NFT Minted!');
      } catch (error) {
        console.error("Minting failed: ", error);
      }
    }
  };

  return (
    <Form onSubmit={mintNFT}>
      <Form.Group>
        <Form.Label>NFT URI</Form.Label>
        <Form.Control 
          type="text" 
          value={mintUri} 
          onChange={(e) => setMintUri(e.target.value)} 
          placeholder="Enter URI of the NFT" 
        />
      </Form.Group>
      <Button type="submit">Mint NFT</Button>
    </Form>
  );
};

export default Mint;
