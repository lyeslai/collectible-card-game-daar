import { ethers } from 'hardhat';
import fs from 'fs';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // Charger les cartes depuis le fichier cards.json
  const cardsFile = fs.readFileSync('cards.json' , 'utf-8');
  const uniqCards = JSON.parse(cardsFile).map((card: any) => card.name);

  // Déployer le contrat Market
  console.log('Deploying Market contract...');
  const Market = await ethers.getContractFactory('Market');
  const market = await Market.deploy(deployer.address, deployer.address);
  await market.deployed();
  console.log('Market contract deployed at:', market.address);

  // Déployer le contrat Collection
  console.log('Deploying Collection contract...');
  const Collection = await ethers.getContractFactory('Collection');
  const collection = await Collection.deploy(
    'Pokemon Collection', // Nom de la collection
    'PKC',                // Symbole
    uniqCards,            // Cartes uniques
    market.address        // Adresse du Market
  );
  await collection.deployed();
  console.log('Collection contract deployed at:', collection.address);

  // Déployer le contrat Booster
  console.log('Deploying Booster contract...');
  const Booster = await ethers.getContractFactory('Booster');
  const booster = await Booster.deploy(
    'BoosterPack',        // Nom du Booster
    'BSTR',               // Symbole du Booster
    collection.address,   // Adresse de la Collection
    deployer.address      // Adresse du propriétaire
  );
  await booster.deployed();
  console.log('Booster contract deployed at:', booster.address);

  // Sauvegarder les adresses des contrats dans un fichier JSON (optionnel)
  const contractAddresses = {
    collection: collection.address,
    booster: booster.address,
    market: market.address,
  };
  fs.writeFileSync('deployed-contracts.json', JSON.stringify(contractAddresses, null, 2));
  console.log('Contract addresses saved to deployed-contracts.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
