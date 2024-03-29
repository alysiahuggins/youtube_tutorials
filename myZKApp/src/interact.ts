/**
 * This script can be used to interact with the Add contract, after deploying it.
 *
 * We call the update() method on the contract, create a proof and send it to the chain.
 * The endpoint that we interact with is read from your config.json.
 *
 * This simulates a user interacting with the zkApp from a browser, except that here, sending the transaction happens
 * from the script and we're using your pre-funded zkApp account to pay the transaction fee. In a real web app, the user's wallet
 * would send the transaction and pay the fee.
 *
 * To run locally:
 * Build the project: `$ npm run build`
 * Run with node:     `$ node build/src/interact.js <network>`.
 */
import { Mina, PrivateKey, Field } from 'snarkyjs';
import fs from 'fs/promises';
import { AgeVerifier } from './AgeVerifier.js';

// check command line arg
let network = process.argv[2];
if (!network)
  throw Error(`Missing <network> argument.

Usage:
node build/src/interact.js <network>

Example:
node build/src/interact.js berkeley
`);
Error.stackTraceLimit = 1000;

// parse config and private key from file
type Config = {
  deployAliases: Record<string, { url: string; keyPath: string }>;
};
let configJson: Config = JSON.parse(await fs.readFile('config.json', 'utf8'));
let config = configJson.deployAliases[network];
let key: { privateKey: string } = JSON.parse(
  await fs.readFile(config.keyPath, 'utf8')
);
let zkAppKey = PrivateKey.fromBase58(key.privateKey);

// set up Mina instance and contract we interact with
const Network = Mina.Network(config.url);
Mina.setActiveInstance(Network);
let zkAppAddress = zkAppKey.toPublicKey();

let zkApp = new AgeVerifier(zkAppAddress);



//senderkey
let configJson2: Config = JSON.parse(await fs.readFile('config.json', 'utf8'));
let config2 = configJson2.deployAliases['berkeley2'];
let key2: { privateKey: string } = JSON.parse(
  await fs.readFile(config2.keyPath, 'utf8')
);
let zkSenderKey = PrivateKey.fromBase58(key2.privateKey);
let zkSenderAddress = zkSenderKey.toPublicKey();
console.log(zkSenderAddress.toBase58());

// compile the contract to create prover keys
console.log('compile the contract...');
await AgeVerifier.compile();

// call update() and send transaction
console.log('build transaction and create proof...');
let tx = await Mina.transaction({ sender: zkSenderAddress, fee: 0.1e9 }, () => {
  zkApp.verifyAge(Field(21), Field(19));
});
await tx.prove();
console.log('send transaction...');
let sentTx = await tx.sign([zkSenderKey]).send();

if (sentTx.hash() !== undefined) {
  console.log(`
Success! Update transaction sent.

Your smart contract state will be updated
as soon as the transaction is included in a block:
https://berkeley.minaexplorer.com/transaction/${sentTx.hash()}
`);
}
