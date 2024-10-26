// Profile.tsx

import React, { useEffect, useState } from 'react';
import { PokemonCard } from '../../Api/types';

interface ProfileProps {
  account: string | null;
  mainContract: any;
  web3: any;
}

const Profile: React.FC<ProfileProps> = ({ account, mainContract, web3 }) => {
  const [ownedCollections, setOwnedCollections] = useState<any[]>([]);
  const [boosterInfo, setBoosterInfo] = useState<any[]>([]);

  useEffect(() => {
    const fetchOwnedCollections = async () => {
      if (!account || !mainContract) return;

      try {
        const collectionCount = await mainContract.methods.collectionCount().call();
        const collections = [];

        for (let i = 0; i < collectionCount; i++) {
          const collection = await mainContract.methods.collections(i).call();
          collections.push(collection);
        }

        setOwnedCollections(collections);
      } catch (error) {
        console.error("Error fetching collections:", error);
      }
    };

    const fetchBoosterInfo = async () => {
      if (!account || !mainContract) return;

      try {
        const boosterCount = await mainContract.methods.boosterCount().call();
        const boosters = [];

        for (let i = 0; i < boosterCount; i++) {
          const booster = await mainContract.methods.boosters(i).call();
          if (booster.owner === account) {
            boosters.push(booster);
          }
        }

        setBoosterInfo(boosters);
      } catch (error) {
        console.error("Error fetching boosters:", error);
      }
    };

    fetchOwnedCollections();
    fetchBoosterInfo();
  }, [account, mainContract]);

  const handleRedeemBooster = async (boosterId: number) => {
  if (!mainContract || !account) {
    alert("Please connect your wallet and contract.");
    return;
  }

  try {
    await mainContract.methods.redeemBooster(boosterId).send({ from: account });
    alert("Booster redeemed successfully!");

    // Mettre à jour les informations des boosters
    setBoosterInfo(prevBoosterInfo =>
      prevBoosterInfo.map(booster =>
        booster.id === boosterId ? { ...booster, redeemed: true } : booster
      )
    );
  } catch (error) {
    console.error("Error redeeming booster:", error);
    alert(`Error redeeming booster: ${error.message}`);
  }
};

  return (
    <div>
      <h1>My Profile</h1>

      <section>
        <h2>Owned Collections</h2>
        {ownedCollections.map((collection, index) => (
          <div key={index}>
            <p>Name: {collection.name}</p>
            <p>Card Count: {collection.cardCount}</p>
          </div>
        ))}
      </section>

      <section>
        <h2>Available Boosters</h2>
        {boosterInfo.map((booster, index) => (
          <div key={index}>
            <p>Booster ID: {booster.id}</p>
            <p>Redeemed: {booster.redeemed ? "Yes" : "No"}</p>
            <button onClick={() => handleRedeemBooster(booster.id)}>
              Redeem Booster
            </button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Profile;
