const Web3 = require('web3')
const axios = require('axios')
require('dotenv').config()

const RPC_URL = process.env.RPC_URL
const PRIVATE_KEY = process.env.PRIVATE_KEY

const web3 = new Web3(RPC_URL)
const wallet = web3.eth.accounts.wallet.add(PRIVATE_KEY)

async function swapper(){
    try{
        const response = await axios.get(`https://api.1inch.exchange/v3.0/137/swap?fromTokenAddress=0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE&toTokenAddress=0x8f3cf7ad23cd3cadbd9735aff958023239c6a063&amount=1000000000000000000&fromAddress=${wallet.address}&slippage=0.1&disableEstimate=true`)
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
    await swapper()
}

main()