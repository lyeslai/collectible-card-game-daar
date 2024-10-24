import React, { useState } from "react";
import { ethers } from "ethers";
import MyContractABI from "../abis/Main.json"; // Assurez-vous que le chemin vers l'ABI est correct

const MintCard = () => {
  const [minting, setMinting] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const mintCard = async () => {
    try {
      setMinting(true);
      setErrorMessage("");

      // Configuration du provider et du signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Adresse du contrat
      const contractAddress = "0xVotreAdresseDeContrat"; // Remplacez par l'adresse de votre contrat déployé
      const contract = new ethers.Contract(contractAddress, MyContractABI, signer); // Utilisation de l'ABI correcte ici

      // Si l'adresse du destinataire est un ENS, essayez de la résoudre
      let recipientAddress = recipient;
      if (recipientAddress.endsWith(".eth")) {
        console.log("Résolution du nom ENS...");
        recipientAddress = await provider.resolveName(recipient);
        if (!recipientAddress) {
          throw new Error("Le réseau ne supporte pas ENS ou le nom ENS est incorrect.");
        }
        console.log("Nom ENS résolu en adresse:", recipientAddress);
      }

      // Appel du contrat pour mint
      const tx = await contract.mint(recipientAddress, { gasLimit: 3000000 });
      await tx.wait();
      console.log("Minting successful!");

    } catch (error: any) {
      console.error("Erreur lors du minting :", error);
      setErrorMessage(error.message || "Une erreur est survenue lors du minting.");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div>
      <h1>Mint a Card</h1>
      <input
        type="text"
        placeholder="Adresse du destinataire ou ENS"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
      />
      <button onClick={mintCard} disabled={minting}>
        {minting ? "Minting..." : "Mint"}
      </button>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
    </div>
  );
};

export default MintCard;
