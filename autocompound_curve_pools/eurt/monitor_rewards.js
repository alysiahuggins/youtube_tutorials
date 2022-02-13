const Web3 = require('web3');
require('dotenv').config();

const web3 = new Web3(process.env.POOL_RPC_URL);
const lpWallet = process.env.USER_WALLET;

async function getRewardTokens(crvGaugeSC, rewardTokens){
    try{
        rewardsToClaim = [];
        for(let i=0; i<rewardTokens.length; i++){
            rewards = await crvGaugeSC.methods.claimable_reward_write(lpWallet, rewardTokens[i]).call();
            rewardsToClaim.push({
                'rewardTokenAddr': rewardTokens[i],
                'claimableRewards': rewards
            });
        }
        return rewardsToClaim;
    }catch(err){
        console.error(`getRewardTokens Error: ${err.message}`);
        return [];
    }
    

}

async function checkRewards(crvGaugeSC){
    try{
        rewardAddr = '';
        rewardTokens = [];
        index = 0;
        while(rewardAddr!='0x0000000000000000000000000000000000000000'){
            rewardAddr = await crvGaugeSC.methods.reward_tokens(index).call();
            if(rewardAddr!='0x0000000000000000000000000000000000000000') rewardTokens.push(rewardAddr);
            index = index+1;
        }
        return rewardTokens;
    }catch(err){
        console.error(`checkRewards Error: ${err.message}`);
        return [];
    }
    
}

async function main(){
    
    block = await web3.eth.getBlockNumber();
    
    console.log(block);

    const curveGaugeAddr = process.env.POOL_ADDR;
    const curveGaugeABI = JSON.parse(process.env.POOL_ABI);
    const crvGaugeSC = new web3.eth.Contract(curveGaugeABI, curveGaugeAddr);
    rewardTokens = await checkRewards(crvGaugeSC);
    rewardsToClaim = await getRewardTokens(crvGaugeSC, rewardTokens);
    console.log(rewardsToClaim);
    console.log(await web3.eth.getTransactionCount(lpWallet));

}

main();
