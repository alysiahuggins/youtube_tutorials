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
 * Run with node:     `$ node build/src/interact.js <deployAlias>`.
 */
import { Mina, PrivateKey, Poseidon, Field, CircuitString, MerkleTree, MerkleWitness } from 'snarkyjs';
import fs from 'fs/promises';
import { SoundXYZVoting } from './SoundXYZVoting.js';
import { treeHeight, Song, MerkleWitness4 } from './SoundXYZVoting.js';


function createSong(songName: string, songArtist: string){
  const song = new Song(
    {
      songName: Poseidon.hash(CircuitString.fromString(songName).toFields()), 
      songArtist: Poseidon.hash(CircuitString.fromString(songArtist).toFields()),
      songVotes: Field(0)
    });

  return song;
}

function createTree(): MerkleTree {
  const tree = new MerkleTree(treeHeight);

  const song0 = createSong("what it's like to lose",'Reo Cragun');
  const song1 = createSong("V Buterin",'Optimism Collective');
  const song2 = createSong("Horizon",'Rohki');
  const song3 = createSong("Carry me home",'Josh Savage');
  const song4 = createSong("Memories x Daisies Mashup",'krp');


  tree.setLeaf(0n, Poseidon.hash(Song.toFields(song0)));
  tree.setLeaf(1n, Poseidon.hash(Song.toFields(song1)));
  tree.setLeaf(2n, Poseidon.hash(Song.toFields(song2)));
  tree.setLeaf(3n, Poseidon.hash(Song.toFields(song3)));
  tree.setLeaf(4n, Poseidon.hash(Song.toFields(song4)));
  return tree;
}

// check command line arg
let deployAlias = process.argv[2];
if (!deployAlias)
  throw Error(`Missing <deployAlias> argument.

Usage:
node build/src/interact.js <deployAlias>
`);
Error.stackTraceLimit = 1000;

// parse config and private key from file
type Config = {
  deployAliases: Record<
    string,
    {
      url: string;
      keyPath: string;
      fee: string;
      feepayerKeyPath: string;
      feepayerAlias: string;
    }
  >;
};
let configJson: Config = JSON.parse(await fs.readFile('config.json', 'utf8'));
let config = configJson.deployAliases[deployAlias];
let feepayerKeysBase58: { privateKey: string; publicKey: string } = JSON.parse(
  await fs.readFile(config.feepayerKeyPath, 'utf8')
);

let zkAppKeysBase58: { privateKey: string; publicKey: string } = JSON.parse(
  await fs.readFile(config.keyPath, 'utf8')
);

let feepayerKey = PrivateKey.fromBase58(feepayerKeysBase58.privateKey);
let zkAppKey = PrivateKey.fromBase58(zkAppKeysBase58.privateKey);

// set up Mina instance and contract we interact with
const Network = Mina.Network(config.url);
const fee = Number(config.fee) * 1e9; // in nanomina (1 billion = 1.0 mina)
Mina.setActiveInstance(Network);
let feepayerAddress = feepayerKey.toPublicKey();
let zkAppAddress = zkAppKey.toPublicKey();
let zkApp = new SoundXYZVoting(zkAppAddress);

let sentTx;
// compile the contract to create prover keys
console.log('compile the contract...');
await SoundXYZVoting.compile();
try {
  const tree = createTree();
  const song0 = createSong("what it's like to lose",'Reo Cragun');
  const path = new MerkleWitness4(tree.getWitness(0n));

  //call update() and send transaction
  console.log('vote for song...');
  let tx = await Mina.transaction({ sender: feepayerAddress, fee }, () => {
    zkApp.voteForSong(song0, path);
  });
  await tx.prove();
  console.log('send transaction...');
  sentTx = await tx.sign([feepayerKey]).send();
} catch (err) {
  console.log(err);
}
if (sentTx?.hash() !== undefined) {
  console.log(`
Success! Update transaction sent.

Your smart contract state will be updated
as soon as the transaction is included in a block:
https://berkeley.minaexplorer.com/transaction/${sentTx.hash()}
`);

}
