import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { PokemonCard } from '../../Api/types';



interface ProfileProps {
  account: string | null;
  mainContract: any;
  web3: Web3 | null;
}

const Profile: React.FC<ProfileProps> = ({ account, mainContract, web3 }) => {
  const [collections, setCollections] = useState<any[]>([]);
  const [ownedNFTs, setOwnedNFTs] = useState<PokemonCard[]>([]);
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    if (!mainContract || !account || !web3) {
      setStatus("Please connect your wallet and contract.");
      return;
    }

    const fetchCollections = async () => {
      try {
        setStatus("Fetching collections...");
        console.log("mainContract methods:", mainContract.methods);
        console.log("Calling collectionCount...");
        const collectionCount = await mainContract.methods.collectionCount().call();
        console.log("Collection count:", collectionCount);
        // ...
      
        const collectionsData = [];

        for (let i = 0; i < collectionCount; i++) {
          const collectionAddress = await mainContract.methods.collections(i).call();
          const collectionContract = new web3.eth.Contract(
            [
              { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "type": "function" },
              { "constant": true, "inputs": [], "name": "cardCount", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" },
              { "constant": true, "inputs": [], "name": "nextTokenId", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" },
              { "constant": true, "inputs": [{ "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "name": "", "type": "address" }], "type": "function" }
            ],
            collectionAddress
          );

          const name = await collectionContract.methods.name().call();
          const cardCount = await collectionContract.methods.cardCount().call();
          const nextTokenId = await collectionContract.methods.nextTokenId().call();
          
          collectionsData.push({
            id: i,
            address: collectionAddress,
            name,
            cardCount,
            nextTokenId
          });
        }

        setCollections(collectionsData);
        setStatus("Collections loaded!");
      } catch (error) {
        console.error("Error fetching collections:", error);
        console.error("Error details:", error.message);
        setStatus("Failed to load collections.");
      }
    };

    const fetchOwnedNFTs = async () => {
      if (!mainContract || !account || !web3) return;

      try {
        setStatus("Fetching owned NFTs...");
        const nfts = [];

        for (const collection of collections) {
          const collectionContract = new web3.eth.Contract(
            [
              { "constant": true, "inputs": [{ "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "name": "", "type": "address" }], "type": "function" },
              { "constant": true, "inputs": [{ "name": "tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "name": "", "type": "string" }], "type": "function" }
            ],
            collection.address
          );

          for (let tokenId = 1; tokenId < collection.nextTokenId; tokenId++) {
            const owner = await collectionContract.methods.ownerOf(tokenId).call();
            if (owner.toLowerCase() === account.toLowerCase()) {
              const tokenURI = await collectionContract.methods.tokenURI(tokenId).call();
              nfts.push({ tokenId, collectionName: collection.name, tokenURI });
            }
          }
        }

        setOwnedNFTs(nfts);
        setStatus("Owned NFTs loaded!");
        
      } catch (error) {
        console.error("Error fetching owned NFTs:", error);
        setStatus("Failed to load owned NFTs.");
      }
    };

    fetchCollections().then(fetchOwnedNFTs);
  }, [mainContract, account, web3]);

  if (!account || !mainContract || !web3) {
    return <p>Please connect your wallet and ensure contract is loaded.</p>;
  }

  return (
    <div>
      <h1>Profile</h1>
      <p>Account: {account}</p>
      <h2>Your Collections</h2>
      <div>
        {collections.map((collection) => (
          <div key={collection.id}>
            <h3>{collection.name}</h3>
            <p>Address: {collection.address}</p>
            <p>Card Count: {collection.cardCount}</p>
            <p>Next Token ID: {collection.nextTokenId}</p>
          </div>
        ))}
      </div>

      <h2>Your Owned NFTs</h2>
      <div className="nfts-grid">
        {ownedNFTs.map((nft, index) => (
          <div key={index} className="nft-card">
            <p>Collection: {nft.collectionName}</p>
            <p>Token ID: {nft.tokenId}</p>
            <img src={nft.tokenURI} alt={`Token ${nft.tokenId}`} width="100" height="100" />
          </div>
        ))}
      </div>

      <p>{status}</p>
    </div>
  );
};

export default Profile;
