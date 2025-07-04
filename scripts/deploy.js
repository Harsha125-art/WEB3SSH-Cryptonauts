const hre = require("hardhat");

async function main() {
  const FundChain = await hre.ethers.getContractFactory("FundChain");
  const contract = await FundChain.deploy();
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
