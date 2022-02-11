const Web3 = require('web3');
require('dotenv').config();
const aave = require('./aave.js');

const web3 = new Web3('https://api.avax.network/ext/bc/C/rpc');
const aave_pool_addr = '0x5B5CFE992AdAC0C9D48E05854B2d91C73a003858';
const aave_pool_abi = [{"name":"Deposit","inputs":[{"name":"provider","type":"address","indexed":true},{"name":"value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"Withdraw","inputs":[{"name":"provider","type":"address","indexed":true},{"name":"value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"CommitOwnership","inputs":[{"name":"admin","type":"address","indexed":false}],"anonymous":false,"type":"event"},{"name":"ApplyOwnership","inputs":[{"name":"admin","type":"address","indexed":false}],"anonymous":false,"type":"event"},{"name":"Transfer","inputs":[{"name":"_from","type":"address","indexed":true},{"name":"_to","type":"address","indexed":true},{"name":"_value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"Approval","inputs":[{"name":"_owner","type":"address","indexed":true},{"name":"_spender","type":"address","indexed":true},{"name":"_value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"stateMutability":"nonpayable","type":"constructor","inputs":[{"name":"_admin","type":"address"},{"name":"_lp_token","type":"address"}],"outputs":[]},{"stateMutability":"view","type":"function","name":"decimals","inputs":[],"outputs":[{"name":"","type":"uint256"}],"gas":288},{"stateMutability":"view","type":"function","name":"reward_contract","inputs":[],"outputs":[{"name":"","type":"address"}],"gas":2628},{"stateMutability":"view","type":"function","name":"last_claim","inputs":[],"outputs":[{"name":"","type":"uint256"}],"gas":2454},{"stateMutability":"view","type":"function","name":"claimed_reward","inputs":[{"name":"_addr","type":"address"},{"name":"_token","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":2976},{"stateMutability":"view","type":"function","name":"claimable_reward","inputs":[{"name":"_addr","type":"address"},{"name":"_token","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":2944},{"stateMutability":"nonpayable","type":"function","name":"claimable_reward_write","inputs":[{"name":"_addr","type":"address"},{"name":"_token","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":2067577},{"stateMutability":"nonpayable","type":"function","name":"set_rewards_receiver","inputs":[{"name":"_receiver","type":"address"}],"outputs":[],"gas":35643},{"stateMutability":"nonpayable","type":"function","name":"claim_rewards","inputs":[],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"claim_rewards","inputs":[{"name":"_addr","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"claim_rewards","inputs":[{"name":"_addr","type":"address"},{"name":"_receiver","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"deposit","inputs":[{"name":"_value","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"deposit","inputs":[{"name":"_value","type":"uint256"},{"name":"_addr","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"deposit","inputs":[{"name":"_value","type":"uint256"},{"name":"_addr","type":"address"},{"name":"_claim_rewards","type":"bool"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"withdraw","inputs":[{"name":"_value","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"withdraw","inputs":[{"name":"_value","type":"uint256"},{"name":"_claim_rewards","type":"bool"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"transfer","inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":8092437},{"stateMutability":"nonpayable","type":"function","name":"transferFrom","inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":8130387},{"stateMutability":"nonpayable","type":"function","name":"approve","inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":38091},{"stateMutability":"nonpayable","type":"function","name":"increaseAllowance","inputs":[{"name":"_spender","type":"address"},{"name":"_added_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":40635},{"stateMutability":"nonpayable","type":"function","name":"decreaseAllowance","inputs":[{"name":"_spender","type":"address"},{"name":"_subtracted_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":40659},{"stateMutability":"nonpayable","type":"function","name":"set_rewards","inputs":[{"name":"_reward_contract","type":"address"},{"name":"_claim_sig","type":"bytes32"},{"name":"_reward_tokens","type":"address[8]"}],"outputs":[],"gas":4442580},{"stateMutability":"nonpayable","type":"function","name":"commit_transfer_ownership","inputs":[{"name":"addr","type":"address"}],"outputs":[],"gas":39375},{"stateMutability":"nonpayable","type":"function","name":"accept_transfer_ownership","inputs":[],"outputs":[],"gas":39320},{"stateMutability":"view","type":"function","name":"lp_token","inputs":[],"outputs":[{"name":"","type":"address"}],"gas":2928},{"stateMutability":"view","type":"function","name":"balanceOf","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":3173},{"stateMutability":"view","type":"function","name":"totalSupply","inputs":[],"outputs":[{"name":"","type":"uint256"}],"gas":2988},{"stateMutability":"view","type":"function","name":"allowance","inputs":[{"name":"arg0","type":"address"},{"name":"arg1","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":3448},{"stateMutability":"view","type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string"}],"gas":13350},{"stateMutability":"view","type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string"}],"gas":11103},{"stateMutability":"view","type":"function","name":"reward_tokens","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"address"}],"gas":3217},{"stateMutability":"view","type":"function","name":"reward_balances","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":3353},{"stateMutability":"view","type":"function","name":"rewards_receiver","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"address"}],"gas":3383},{"stateMutability":"view","type":"function","name":"claim_sig","inputs":[],"outputs":[{"name":"","type":"bytes"}],"gas":11223},{"stateMutability":"view","type":"function","name":"reward_integral","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":3443},{"stateMutability":"view","type":"function","name":"reward_integral_for","inputs":[{"name":"arg0","type":"address"},{"name":"arg1","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":3688},{"stateMutability":"view","type":"function","name":"admin","inputs":[],"outputs":[{"name":"","type":"address"}],"gas":3288},{"stateMutability":"view","type":"function","name":"future_admin","inputs":[],"outputs":[{"name":"","type":"address"}],"gas":3318}];
const aave_pool_smart_contract = new web3.eth.Contract(aave_pool_abi, aave_pool_addr);
const onBehalfOf = process.env.ON_BEHALF_OF;
web3wallet = web3.eth.accounts.wallet.add(process.env.PRIVATE_KEY);
const POLLING_INTERVAL = (60*60*4*1000);

async function main(){
    console.log(`*** Welcome to your Curve & Aave Auto Claim and Compounder ***`);
    console.log(`!Please use at your own risk and be responsible with your keys!\n\n`);
    await autoClaimAndCompound();

    setInterval(async () => { 
        await autoClaimAndCompound();
    }, POLLING_INTERVAL);
}

async function autoClaimAndCompound(){
    rewardTokens = await getRewardTokens(aave_pool_smart_contract);
    console.log(`You're getting these ${rewardTokens} tokens from Curve`);
    tokenRewards = await checkClaimableRewards(onBehalfOf, rewardTokens, aave_pool_smart_contract);
    console.log(`These rewards ${tokenRewards} are claimable`);
    console.log(`Let's see if these rewards are worth claiming`);
    claimed = await attemptRewardClaim(rewardTokens, tokenRewards);
    compounded = await compoundRewards(rewardTokens, tokenRewards);
}
async function getRewardTokens(smartContract){
    rewardTokens = [];
    rewardToken = '';
    index = 0;
    try{
        while(rewardToken!='0x0000000000000000000000000000000000000000'){
            rewardToken = await smartContract.methods.reward_tokens(index).call();
            if(rewardToken!='0x0000000000000000000000000000000000000000') rewardTokens.push(rewardToken);
            index = index + 1;
        }
    }catch(e){
        console.error(`The following error occurred whilst checking reward Tokens: ${e}`);
    }
    
    return rewardTokens;
}

async function checkClaimableRewards(addr, rewardTokens, smartContract){
    tokenRewards = [];
    try{
        for(let i=0; i<rewardTokens.length; i++){
            rewards = await smartContract.methods.claimable_reward_write(addr, rewardTokens[i]).call();
            tokenRewards.push(rewards);
        }
    }catch(e){
        console.error(`The following error occurred whilst checking claimable rewards: ${e}`);
    }
    return tokenRewards;
}

async function attemptRewardClaim(rewardTokens, tokenRewards){
    claimed = false;
    try{
        wavaxIndex = getWavaxIndex(rewardTokens);
        if(web3.utils.toBN(tokenRewards[wavaxIndex]).gte(web3.utils.toBN(web3.utils.toWei('0.1')))){
            console.log(`There's enough rewards to claim, let's try it.`);
            claimed = await claimRewards();
        }else console.log(`Not enough rewards ${web3.utils.fromWei(tokenRewards[wavaxIndex])} to claim for ${rewardTokens[wavaxIndex]}`);
    }catch(e){
        console.error(`The following error occurred whilst attempting the reward claim: ${e}`);
    }
    return claimed;

}

async function claimRewards(){
    try{
        gas = await aave_pool_smart_contract.methods.claim_rewards(onBehalfOf).estimateGas({
            'from':web3wallet.address
        });
        console.log(`gas required: ${gas}`);
        tx = await aave_pool_smart_contract.methods.claim_rewards(onBehalfOf).send({
            'from':onBehalfOf,
            'gasPrice':'25000000000',
            'gas':gas
        });
        if(tx.status) console.log(`Successful claim ${tx.transactionHash}`);
        return tx.status;
    }catch(e){
        console.error(`The following error occurred whilst claiming the rewards: ${e}`);
    }
    return false;
}

async function compoundRewards(rewardTokens, tokenRewards){
    try{
        wavaxToken = '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7';
        // wavaxRewards = getWavaxRewards(rewardTokens, tokenRewards)
        wavaxBalance = await getTokenBalance(wavaxToken);
        // wavaxRewards = web3.utils.toBN(wavaxRewards).add(web3.utils.toBN(wavaxBalance)).toString()
        if(web3.utils.toBN(wavaxBalance).gte(web3.utils.toBN(web3.utils.toWei('0.1')))){
            console.log(`Let's compound WAVAX Rewards ${web3.utils.fromWei(wavaxBalance)}`);
            success = await aave.deposit(wavaxToken, wavaxBalance, onBehalfOf);
            if(success) console.log(`Rewards compounded, yay!!! :)`);
            return success;
        }
    }catch(e){
        console.error(`The following error occurred whilst compounding the rewards: ${e}`);
    }
    return false;
    
}

function getWavaxIndex(rewardTokens){
    return rewardTokens.map(token => token.toLowerCase()).indexOf('0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7');
}

function getWavaxRewards(rewardTokens, tokenRewards){
    index = getWavaxIndex(rewardTokens);
    if(index<0) console.log('Something went wrong getting rewards');
    else{
        return tokenRewards[index];
    }
    return 0;
}

async function getTokenBalance(token){
    balance = 0;
    try{
        erc20abi = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x06fdde03"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x095ea7b3"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x18160ddd"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x23b872dd"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x313ce567"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x39509351"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"mint","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x40c10f19"},{"constant":false,"inputs":[{"name":"value","type":"uint256"}],"name":"burn","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x42966c68"},{"constant":true,"inputs":[{"name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x70a08231"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"value","type":"uint256"}],"name":"burnFrom","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x79cc6790"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x95d89b41"},{"constant":false,"inputs":[{"name":"account","type":"address"}],"name":"addMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x983b2d56"},{"constant":false,"inputs":[],"name":"renounceMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x98650275"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa457c2d7"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa9059cbb"},{"constant":true,"inputs":[{"name":"account","type":"address"}],"name":"isMinter","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xaa271e1a"},{"constant":true,"inputs":[{"name":"owner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0xdd62ed3e"},{"inputs":[{"name":"_name","type":"string"},{"name":"_symbol","type":"string"},{"name":"_decimals","type":"uint8"}],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterAdded","type":"event","signature":"0x6ae172837ea30b801fbfcdd4108aa1d5bf8ff775444fd70256b44e6bf3dfc3f6"},{"anonymous":false,"inputs":[{"indexed":true,"name":"account","type":"address"}],"name":"MinterRemoved","type":"event","signature":"0xe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb66692"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"},{"anonymous":false,"inputs":[{"indexed":true,"name":"owner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Approval","type":"event","signature":"0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925"}];
        tokenSC = new web3.eth.Contract(erc20abi, token);
        balance = await tokenSC.methods.balanceOf(onBehalfOf).call();
        return balance;
    }catch(e){
        console.error(`getTokenBalance: Error ${e}`);
    }
    return balance;
}
main();