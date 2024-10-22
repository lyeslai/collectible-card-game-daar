import 'dotenv/config';
import { DeployFunction } from 'hardhat-deploy/types';

const deployer: DeployFunction = async (hre) => {
  if (hre.network.config.chainId !== 31337) return;

  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Les arguments attendus par le constructeur de Main.sol
  const collectionName = "My Pokemon Collection"; // Nom de la collection
  const collectionSymbol = "POKE"; // Symbole de la collection
  const uniqCards = ["Pikachu", "Bulbasaur", "Charmander", "Squirtle"]; // Cartes uniques
  const ownerAddress = deployer; // Adresse du déployeur

  // Déploiement du contrat Main avec les arguments requis
  await deploy('Main', {
    from: deployer,
    args: [collectionName, collectionSymbol, uniqCards, ownerAddress], // Les 4 arguments
    log: true,
  });
};

export default deployer;
