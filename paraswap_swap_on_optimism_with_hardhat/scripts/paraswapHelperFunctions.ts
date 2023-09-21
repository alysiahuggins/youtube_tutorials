import axios from 'axios'
import {ethers} from 'ethers';

const ParawapV5URL = 'https://apiv5.paraswap.io'
export async function getPrices(srcToken: string, srcDecimals: number, destToken: string, destDecimals: number, amount: string, side: string, network:number){
    try{
        const result = await axios.get(`${ParawapV5URL}/prices?srcToken=${srcToken}&srcDecimals=${srcDecimals}&destToken=${destToken}&destDecimals=${destDecimals}&amount=${amount}&side=${side}&network=${network}`);
        return result.data.priceRoute;
    }catch(e){
        console.error(e);
        return null;
    }
    
} 

export async function getTransactionData(network: number, priceRoute: any, userAddress: string){
    try{
        const result = await axios.post(
            `${ParawapV5URL}/transactions/${network}?ignoreChecks=true`,
            {
                'srcToken':priceRoute.srcToken,
                'srcDecimals':priceRoute.srcDecimals,
                'destToken':priceRoute.destToken,
                'destDecimals':priceRoute.destDecimals,
                'srcAmount':priceRoute.srcAmount,
                'priceRoute':priceRoute,
                'slippage': 100,
                'userAddress': userAddress
            }
        );
        return result.data;
    }catch(e){
        console.error(e);
        return null;
    }
}

export async function performTransaction(user: ethers.Signer, txData: any): Promise<any>{
    try{
        const tx = await user.sendTransaction(txData);
        return tx;
    }catch(e){
        console.error(e);
        return null;
    }
}


