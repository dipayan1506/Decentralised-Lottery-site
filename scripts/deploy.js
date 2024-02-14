const hre = require("hardhat");

async function main() {
  const lotteryContract = await hre.ethers.deployContract("Lottery");

  await lotteryContract.waitForDeployment();
  console.log("Contract Address: ", lotteryContract.target);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
