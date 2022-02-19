const Web3 = require('web3');

const { chains } = require('./chains');
const { wallets } = require('./wallets');

const polygon = chains.polygon;
const lpWallet = wallets.polygon.primary;
const web3 = new Web3(polygon.rpc_url);

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
    
    console.log(`Current Block ${block}`);

    for (i=0; i<polygon.contracts.length; i++) {
        const curveContract = polygon.contracts[i];
        const crvGaugeSC = new web3.eth.Contract(curveContract.abi, curveContract.address);
        const rewardTokens = await checkRewards(crvGaugeSC);
        const rewardsToClaim = await getRewardTokens(crvGaugeSC, rewardTokens);
        console.log(`${curveContract.name} rewards: ${JSON.stringify(rewardsToClaim)}`);
    }
    console.log('Transaction Count: ' + await web3.eth.getTransactionCount(lpWallet));
}

main();
