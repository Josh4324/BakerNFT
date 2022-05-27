// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hardhat!");

  await greeter.deployed();
  console.log("Greeter deployed to:", greeter.address);

  const BakerNFT = await ethers.getContractFactory("BakerNFT");
  const bakerNFT = await BakerNFT.deploy("https://baker-nft.vercel.app/api/");
  await bakerNFT.deployed();

  const price = ethers.utils.parseUnits("0.001", "ether");
  await bakerNFT.createNFT(price);
  await bakerNFT.createNFT(price);
  await bakerNFT.createNFT(price);
  await bakerNFT.createNFT(price);

  let all = await bakerNFT.getMarket("1");
  let items = await bakerNFT.fetchMarketItems();

  let mine = await bakerNFT.fetchMyNFTs();

  console.log(items);
  console.log(mine);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
