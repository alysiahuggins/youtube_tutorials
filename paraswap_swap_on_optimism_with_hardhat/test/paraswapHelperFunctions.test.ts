import { expect } from "chai";
import { ethers } from "hardhat";
import { getPrices, getTransactionData, performTransaction} from "../scripts/paraswapHelperFunctions";

describe ("Paraswap", function(){
    let network = 10;
    let srcToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
    let srcDecimals = 18;
    let destToken = '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1';
    let destDecimals = 18;
    let amount = ethers.parseEther("10").toString();
    let side = "SELL"
    let ERC20ABI = [
        "function balanceOf(address account) external view returns (uint256)",
    ]

    it("should not return null prices", async function(){
        const prices = await getPrices(srcToken, srcDecimals, destToken, destDecimals, amount, side, network);
        expect(prices).to.not.be.null;
    });

    it("should not return null transaction data", async function(){
        const [user] = await ethers.getSigners();
        const txData = await getTransactionData(network, await getPrices(srcToken, srcDecimals, destToken, destDecimals, amount, side, network), user.address);
        expect(txData).to.not.be.null;
    });

    it("should perform swap", async function(){
        const [user] = await ethers.getSigners();
        const txData = await getTransactionData(network, await getPrices(srcToken, srcDecimals, destToken, destDecimals, amount, side, network), user.address);
        const localhostTxData = 
        {
            'from': txData.from,
            'to': txData.to,
            'value': txData.value,
            'data': txData.data,
            'gasPrice': txData.gasPrice,
            'chainId': 31337
        }
        const DAI = await ethers.getContractAt(ERC20ABI, destToken, user);
        const balanceBefore = await DAI.balanceOf(user.address);
        const tx = await performTransaction(user, localhostTxData);
        const balanceAfter = await DAI.balanceOf(user.address);

        expect(balanceAfter).to.be.greaterThan(balanceBefore);
    }).timeout(50000);

})