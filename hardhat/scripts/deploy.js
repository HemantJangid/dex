const { ethers } = require("hardhat");
const { CRYPTO_DEV_TOKEN_ADDRESS } = require("../constants");

async function main() {
  const Exchange = await ethers.getContractFactory("Exchange");
  const exchange = await Exchange.deploy(CRYPTO_DEV_TOKEN_ADDRESS);
  await exchange.deployed();

  console.log("Exchange deployed to:", exchange.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
