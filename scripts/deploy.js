const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("InnoFund"); // ✅ Match your contract name
  const contract = await Contract.deploy(); // ✅ Deploys the contract

  await contract.waitForDeployment(); // ✅ CORRECT way in latest Hardhat/Ethers

  console.log("Contract deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
