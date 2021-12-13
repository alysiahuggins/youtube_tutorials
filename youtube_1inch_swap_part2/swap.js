const Web3 = require('web3')
const axios = require('axios')
require('dotenv').config()

const RPC_URL = process.env.RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

const web3 = new Web3(RPC_URL)
const wallet = web3.eth.accounts.wallet.add(PRIVATE_KEY)

async function approve(tokenAddress, tokenAmount){
    try{
        const response = await axios.get(`https://api.1inch.exchange/v3.0/137/approve/calldata?tokenAddress=${tokenAddress}&amount=${tokenAmount}`)
        if(response.data){
            data = response.data
            data.gas = 1000000
            data.from = wallet.address
            tx = await web3.eth.sendTransaction(data)
            if(tx.status){
                console.log("Approval Successul! :)")
            }else{
                console.log("Approval unsuccesful :(")
                console.log(tx)
            }
        }
    }catch(err){
        console.log("could not approve token")
        console.log(err)
    }
}

async function swapper(fromTokenAddress, toTokenAddress, fromTokenAmount){
    try{
        if(fromTokenAddress!='0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'){
            await approve(fromTokenAddress, fromTokenAmount)
        }
        const response = await axios.get(`https://api.1inch.exchange/v3.0/137/swap?fromTokenAddress=${fromTokenAddress}&toTokenAddress=${toTokenAddress}&amount=${fromTokenAmount}&fromAddress=${wallet.address}&slippage=0.1&disableEstimate=true`)
        if(response.data){
            data = response.data
            data.tx.gas = 1000000
            tx = await web3.eth.sendTransaction(data.tx)
            if(tx.status){
                console.log("Swap Successfull! :)")
            }
        }
    }catch(err){
        console.log("swapper encountered an error below")
        console.log(err)
    }

}
async function main(){
    fromTokenAddress = '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063' //dai
    toTokenAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' //matic
    fromTokenAmount = '1000000000000000000' //1 ether

    await swapper(fromTokenAddress, toTokenAddress, fromTokenAmount)
}

main()