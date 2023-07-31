const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  console.log("network connected to ", hre.network.name);
  const fxaddress = "0xF9bc4a80464E48369303196645e876c8C7D972de";
  const contractdeployedaddress = "0xF4Dc0F03b47f9e9c178061e7410fba7460A56be8";

  const nfts = await hre.ethers.getContractFactory("hemadri");
  const contract = await nfts.attach(contractdeployedaddress);
  console.log("Contract address is", contract.address);

  // Token IDs of the nfts
  const id = [11876, 11877, 11878, 11879, 11880];
  const wallet = "0x82366667660c41efa25360665B4d039Ac7E4556E"; // Wallet address

  // Increase the gas price for the transaction
  const gasPrice = ethers.utils.parseUnits('100', 'gwei'); // Set the gas price to 100 gwei (adjust as needed)

  // Approve and deposit each token to the FxPortal Bridge for sending
  for (let i = 0; i < id.length; i++) {
    const Id = id[i];
    console.log(`Confirm token with token ID ${Id} for transfer`);
    await contract.approve(fxaddress, Id);

    console.log(`Estimating gas cost for token ID ${Id}`);
    const estimatedGas = await contract.estimateGas.safeTransferFrom(wallet, fxaddress, Id, { gasPrice });
    const gasLimit = estimatedGas.add(100000); // Add some buffer to the estimated gas to prevent potential underestimation

    console.log(`Store token with token ID ${Id} on the Bridge`);
    await contract["safeTransferFrom(address,address,uint256)"](
      wallet,
      fxaddress,
      Id,
      { gasPrice, gasLimit } // Pass the gasPrice and gasLimit options
    );

    console.log(`Token ${Id} successfully transferred`);
  }

  console.log("tokens transfer successful");

  // Print the balance of the wallet
  const walletBalance = await hre.ethers.provider.getBalance(wallet);
  console.log("Balance is:", walletBalance.toString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });