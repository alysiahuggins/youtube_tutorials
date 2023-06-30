import { Field, SmartContract, state, State, method, Struct, MerkleWitness, Poseidon, Provable } from 'snarkyjs';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export const treeHeight = 4;
export class MerkleWitness4 extends MerkleWitness(treeHeight) {}
export class Song extends Struct({
  songName: Field,
  songArtist: Field,
  songVotes: Field,

}){
  vote(){
    this.songVotes = this.songVotes.add(1)
  };
}
export class SoundXYZVoting extends SmartContract {
  @state(Field) numVoters = State<Field>();
  @state(Field) winningSong = State<Field>();
  @state(Field) winningVotes = State<Field>();
  @state(Field) treeRoot = State<Field>();

  @method initState(initialRoot: Field){
    this.treeRoot.set(initialRoot);
  }
  

  @method update() {
    const currentState = this.numVoters.getAndAssertEquals();
    const newState = currentState.add(2);
    this.numVoters.set(newState);
  }

  @method voteForSong(song: Song, path: MerkleWitness4){
    //get the tree root
    const treeRoot = this.treeRoot.getAndAssertEquals();

    //check to see whether the song is in the merkle tree
    const songRoot = path.calculateRoot(Poseidon.hash(Song.toFields(song)));
    songRoot.assertEquals(treeRoot);

    //vote for this song
    song.vote();

    //include udpated song
    const newSongRoot = path.calculateRoot(Poseidon.hash(Song.toFields(song)));
    this.treeRoot.set(newSongRoot);

    //increment numVoters
    this.numVoters.set(this.numVoters.getAndAssertEquals().add(1));

    //get current winner and update winner
    const winningSong = this.winningSong.getAndAssertEquals();
    const winningVotes = this.winningVotes.getAndAssertEquals();
    const newWinningSong = Provable.if(winningVotes.lessThan(song.songVotes), song.songName, winningSong);
    const newWinningVotes = Provable.if(winningVotes.lessThan(song.songVotes), song.songVotes, winningVotes);
    this.winningSong.set(newWinningSong);
    this.winningVotes.set(newWinningVotes);
  }

}
