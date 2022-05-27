const { ethers } = require("hardhat");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
  const nftContract = await ethers.getContractFactory("BakerNFT");

  // here we deploy the contract
  const deployedNFTContract = await nftContract.deploy(
    "https://baker-nft.vercel.app/api/"
  );

  // Wait for it to finish deploying
  //await deployedNFTContract.deployed();

  // print the address of the deployed contract
  //console.log("Baker Contract Address:", deployedNFTContract.address);

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

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
