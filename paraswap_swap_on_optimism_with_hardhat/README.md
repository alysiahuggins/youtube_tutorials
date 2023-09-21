# Paraswap Swap with Hardhat Test

This project shows you how you can use hardhat to test other smart contracts that don't have smart contracts deployed on a testnet, e.g. DeFi Aggregators like Paraswap. If it weren't for tools like Hardhat, you'd have to deploy to mainnet and waste real gas fees while building. 

Watch the Youtube Tutorial [here](https://www.youtube.com/watch?v=ud6O80BU6vM):
[![Video Thumbnail](https://img.youtube.com/vi/ud6O80BU6vM/maxresdefault.jpg)](https://www.youtube.com/watch?v=ud6O80BU6vM)


## Testing by Forking Optimism Mainnet
Open a new tab

`npx hardhat node --fork $OPTIMISM_RPC_URL`

in this folder run

`npx hardhat test --network localhost`

## Other Commands
```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat run scripts/deploy.ts
```