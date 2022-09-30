const Web3 = require('web3')
require('dotenv').config()
const usdtAbi = require('./usdt_abi.json')
const usdtAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7'
const web3 = new Web3(process.env.ETH_URL)
const walletAddress = "0x974CaA59e49682CdA0AD2bbe82983419A2ECC400"
async function main(){
    try{

       balance =  await web3.eth.getBalance(walletAddress)
       console.log(web3.utils.fromWei(balance))
       usdtAbiSmartContract = new web3.eth.Contract(usdtAbi, usdtAddress)
       usdtBalance = await usdtAbiSmartContract.methods.balanceOf(walletAddress).call()
       console.log("USDT Balance: "+ web3.utils.fromWei(usdtBalance, 'gwei'))
    }catch(e){
        console.log(e.toString())
    }
}

main()