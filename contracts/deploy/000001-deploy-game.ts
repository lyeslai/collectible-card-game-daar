import 'dotenv/config';
import { DeployFunction } from 'hardhat-deploy/types';
import fs from 'fs';

const deployer: DeployFunction = async (hre) => {
  if (hre.network.config.chainId !== 31337) return;

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Charger les données Pokémon depuis le fichier JSON
  const pokemonData = JSON.parse(fs.readFileSync('./pokemonData.json', 'utf-8'));

  // Récupérer les URL des images des cartes Pokémon
  const uniqCards = pokemonData.cards.map(card => card.imageUrl);

  const collectionName = "Pokemon Collection";
  const collectionSymbol = "POKE";
  const ownerAddress = deployer;

  // Déploiement du contrat Main avec les cartes Pokémon récupérées
  await deploy('Main', {
    from: deployer,
    args: [collectionName, collectionSymbol, uniqCards, ownerAddress],
    log: true,
  });
};

export default deployer;
