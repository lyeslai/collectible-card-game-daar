import 'dotenv/config'
import { DeployFunction } from 'hardhat-deploy/types'

const deployer: DeployFunction = async (hre) => {
  const { deployments, getNamedAccounts, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  if (network.config.chainId !== 31337) {
    log("Ce script est conçu pour le réseau local.");
    return;
  }

  log("Déploiement de Main...");

  // Déployer le contrat Main
  const main = await deploy('Main', {
    from: deployer,
    log: true,
  });

  log(`Main déployé à l'adresse : ${main.address}`);
};

export default deployer;
