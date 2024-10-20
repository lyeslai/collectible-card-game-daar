import { DeployFunction } from 'hardhat-deploy/types'
import { setEnv } from '../server'




const deployer: DeployFunction = async hre => {
  const Main = await hre.ethers.getContractFactory("Main");
  const { deployer } = await hre.getNamedAccounts();
  const main = (await Main.deploy(deployer))
  await main.deployed();
  console.log("Main deployed to:", main.address);
  await setEnv(main, deployer, hre)
}


export default deployer


