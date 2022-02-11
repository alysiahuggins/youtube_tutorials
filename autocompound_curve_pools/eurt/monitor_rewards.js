const Web3 = require('web3');
require('dotenv').config();

const web3 = new Web3(process.env.RPC_URL);
const lpWallet = '0xb05424eb5f8ee658e8e9de3ce9af9d6463517fa9';

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

    const curveGaugeAddr = '0x40c0e9376468b4f257d15F8c47E5D0C646C28880';
    const curveGaugeABI = [{"name":"Deposit","inputs":[{"name":"provider","type":"address","indexed":true},{"name":"value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"Withdraw","inputs":[{"name":"provider","type":"address","indexed":true},{"name":"value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"CommitOwnership","inputs":[{"name":"admin","type":"address","indexed":false}],"anonymous":false,"type":"event"},{"name":"ApplyOwnership","inputs":[{"name":"admin","type":"address","indexed":false}],"anonymous":false,"type":"event"},{"name":"Transfer","inputs":[{"name":"_from","type":"address","indexed":true},{"name":"_to","type":"address","indexed":true},{"name":"_value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"name":"Approval","inputs":[{"name":"_owner","type":"address","indexed":true},{"name":"_spender","type":"address","indexed":true},{"name":"_value","type":"uint256","indexed":false}],"anonymous":false,"type":"event"},{"stateMutability":"nonpayable","type":"constructor","inputs":[{"name":"_admin","type":"address"},{"name":"_lp_token","type":"address"}],"outputs":[]},{"stateMutability":"view","type":"function","name":"decimals","inputs":[],"outputs":[{"name":"","type":"uint256"}],"gas":288},{"stateMutability":"view","type":"function","name":"reward_contract","inputs":[],"outputs":[{"name":"","type":"address"}],"gas":2628},{"stateMutability":"view","type":"function","name":"last_claim","inputs":[],"outputs":[{"name":"","type":"uint256"}],"gas":2454},{"stateMutability":"view","type":"function","name":"claimed_reward","inputs":[{"name":"_addr","type":"address"},{"name":"_token","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":2976},{"stateMutability":"view","type":"function","name":"claimable_reward","inputs":[{"name":"_addr","type":"address"},{"name":"_token","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":2944},{"stateMutability":"nonpayable","type":"function","name":"claimable_reward_write","inputs":[{"name":"_addr","type":"address"},{"name":"_token","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":2067577},{"stateMutability":"nonpayable","type":"function","name":"set_rewards_receiver","inputs":[{"name":"_receiver","type":"address"}],"outputs":[],"gas":35643},{"stateMutability":"nonpayable","type":"function","name":"claim_rewards","inputs":[],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"claim_rewards","inputs":[{"name":"_addr","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"claim_rewards","inputs":[{"name":"_addr","type":"address"},{"name":"_receiver","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"deposit","inputs":[{"name":"_value","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"deposit","inputs":[{"name":"_value","type":"uint256"},{"name":"_addr","type":"address"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"deposit","inputs":[{"name":"_value","type":"uint256"},{"name":"_addr","type":"address"},{"name":"_claim_rewards","type":"bool"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"withdraw","inputs":[{"name":"_value","type":"uint256"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"withdraw","inputs":[{"name":"_value","type":"uint256"},{"name":"_claim_rewards","type":"bool"}],"outputs":[]},{"stateMutability":"nonpayable","type":"function","name":"transfer","inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":8092437},{"stateMutability":"nonpayable","type":"function","name":"transferFrom","inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":8130387},{"stateMutability":"nonpayable","type":"function","name":"approve","inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":38091},{"stateMutability":"nonpayable","type":"function","name":"increaseAllowance","inputs":[{"name":"_spender","type":"address"},{"name":"_added_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":40635},{"stateMutability":"nonpayable","type":"function","name":"decreaseAllowance","inputs":[{"name":"_spender","type":"address"},{"name":"_subtracted_value","type":"uint256"}],"outputs":[{"name":"","type":"bool"}],"gas":40659},{"stateMutability":"nonpayable","type":"function","name":"set_rewards","inputs":[{"name":"_reward_contract","type":"address"},{"name":"_claim_sig","type":"bytes32"},{"name":"_reward_tokens","type":"address[8]"}],"outputs":[],"gas":4442580},{"stateMutability":"nonpayable","type":"function","name":"commit_transfer_ownership","inputs":[{"name":"addr","type":"address"}],"outputs":[],"gas":39375},{"stateMutability":"nonpayable","type":"function","name":"accept_transfer_ownership","inputs":[],"outputs":[],"gas":39320},{"stateMutability":"view","type":"function","name":"lp_token","inputs":[],"outputs":[{"name":"","type":"address"}],"gas":2928},{"stateMutability":"view","type":"function","name":"balanceOf","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":3173},{"stateMutability":"view","type":"function","name":"totalSupply","inputs":[],"outputs":[{"name":"","type":"uint256"}],"gas":2988},{"stateMutability":"view","type":"function","name":"allowance","inputs":[{"name":"arg0","type":"address"},{"name":"arg1","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":3448},{"stateMutability":"view","type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string"}],"gas":13350},{"stateMutability":"view","type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string"}],"gas":11103},{"stateMutability":"view","type":"function","name":"reward_tokens","inputs":[{"name":"arg0","type":"uint256"}],"outputs":[{"name":"","type":"address"}],"gas":3217},{"stateMutability":"view","type":"function","name":"reward_balances","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":3353},{"stateMutability":"view","type":"function","name":"rewards_receiver","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"address"}],"gas":3383},{"stateMutability":"view","type":"function","name":"claim_sig","inputs":[],"outputs":[{"name":"","type":"bytes"}],"gas":11223},{"stateMutability":"view","type":"function","name":"reward_integral","inputs":[{"name":"arg0","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":3443},{"stateMutability":"view","type":"function","name":"reward_integral_for","inputs":[{"name":"arg0","type":"address"},{"name":"arg1","type":"address"}],"outputs":[{"name":"","type":"uint256"}],"gas":3688},{"stateMutability":"view","type":"function","name":"admin","inputs":[],"outputs":[{"name":"","type":"address"}],"gas":3288},{"stateMutability":"view","type":"function","name":"future_admin","inputs":[],"outputs":[{"name":"","type":"address"}],"gas":3318}];
    const crvGaugeSC = new web3.eth.Contract(curveGaugeABI, curveGaugeAddr);
    rewardTokens = await checkRewards(crvGaugeSC);
    rewardsToClaim = await getRewardTokens(crvGaugeSC, rewardTokens);
    console.log(rewardsToClaim);
    console.log(await web3.eth.getTransactionCount(lpWallet));

}

main();
