import { SoundXYZVoting } from './SoundXYZVoting';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate, MerkleTree, CircuitString, Poseidon } from 'snarkyjs';
import { treeHeight, Song, MerkleWitness4 } from './SoundXYZVoting';
/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

function createSong(songName: string, songArtist: string){
  const song = new Song(
    {
      songName: Poseidon.hash(CircuitString.fromString(songName).toFields()), 
      songArtist: Poseidon.hash(CircuitString.fromString(songArtist).toFields()),
      songVotes: Field(0)
    });

  return song;
}

function createTree(): any {
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


describe('SoundXYZVoting', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: SoundXYZVoting,
    tree: MerkleTree;

  beforeAll(async () => {
    if (proofsEnabled) await SoundXYZVoting.compile();
  });

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled });
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1]);
    zkAppPrivateKey = PrivateKey.random();
    zkAppAddress = zkAppPrivateKey.toPublicKey();
    zkApp = new SoundXYZVoting(zkAppAddress);
    tree = createTree();
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
      zkApp.initState(tree.getRoot());
    });
    await txn.prove();
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `Add` smart contract', async () => {
    await localDeploy();
    const treeRoot = zkApp.treeRoot.get();
    expect(treeRoot).toEqual(tree.getRoot());
  });

  it('votes on song are incremented correctly', async () => {
    const song1 = createSong("V Buterin",'Optimism Collective');
    song1.vote();
    expect(song1.songVotes).toEqual(Field(1));
  });

  it('correctly votes for song', async () => {
    await localDeploy();

    const song1 = createSong("V Buterin",'Optimism Collective');
    const path = new MerkleWitness4(tree.getWitness(1n));

    // update transaction
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.voteForSong(song1, path);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const numVoters = zkApp.numVoters.get();
    expect(numVoters).toEqual(Field(1));

    const winningSong = zkApp.winningSong.get();
    expect(winningSong).toEqual(song1.songName);

    const winningVotes = zkApp.winningVotes.get();
    expect(winningVotes).toEqual(Field(1));

    song1.vote();
    tree.setLeaf(1n, Poseidon.hash(Song.toFields(song1)));
    const treeRoot = zkApp.treeRoot.get();
    expect(treeRoot).toEqual(tree.getRoot());

  });

  it('does not vote for song that is not in the tree', async () => {
    await localDeploy();

    const song1 = createSong("Satoshi Nakamoto",'Optimism Collective');
    const path = new MerkleWitness4(tree.getWitness(1n));

    // update transaction
    let voted = false;
    try{
      const txn = await Mina.transaction(senderAccount, () => {
        zkApp.voteForSong(song1, path);
      });
      await txn.prove();
      await txn.sign([senderKey]).send();
      voted = true

    }catch(e){}
    

   
    expect(voted).toEqual(false);

  });

  

  it('correctly votes for two songs and chooses the right winner', async () => {
    await localDeploy();
    const song0 = createSong("what it's like to lose",'Reo Cragun');
    const song1 = createSong("V Buterin",'Optimism Collective');

    // update transaction
    let path0 = new MerkleWitness4(tree.getWitness(0n));

    let txn = await Mina.transaction(senderAccount, () => {
      zkApp.voteForSong(song0, path0);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
    song0.vote();
    tree.setLeaf(0n, Poseidon.hash(Song.toFields(song0)));


    // update transaction
    let path1 = new MerkleWitness4(tree.getWitness(1n));

    txn = await Mina.transaction(senderAccount, () => {
      zkApp.voteForSong(song1, path1);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
    song1.vote();
    tree.setLeaf(1n, Poseidon.hash(Song.toFields(song1)));



    // update transaction
    path0 = new MerkleWitness4(tree.getWitness(0n));

    txn = await Mina.transaction(senderAccount, () => {
      zkApp.voteForSong(song0, path0);
    });
    await txn.prove();
    await txn.sign([senderKey]).send();
    song0.vote();
    tree.setLeaf(0n, Poseidon.hash(Song.toFields(song0)));
    


    const numVoters = zkApp.numVoters.get();
    expect(numVoters).toEqual(Field(3));

    const winningSong = zkApp.winningSong.get();
    expect(winningSong).toEqual(song0.songName);

    const winningVotes = zkApp.winningVotes.get();
    expect(winningVotes).toEqual(Field(2));


    const treeRoot = zkApp.treeRoot.get();
    expect(treeRoot).toEqual(tree.getRoot());

  });
});


