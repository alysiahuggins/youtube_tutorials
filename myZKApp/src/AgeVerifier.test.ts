import { AgeVerifier } from './AgeVerifier';
import { Field, Mina, PrivateKey, PublicKey, AccountUpdate } from 'snarkyjs';

/*
 * This file specifies how to test the `Add` example smart contract. It is safe to delete this file and replace
 * with your own tests.
 *
 * See https://docs.minaprotocol.com/zkapps for more info.
 */

let proofsEnabled = false;

describe('AgeVerifier', () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: AgeVerifier;

  beforeAll(async () => {
    if (proofsEnabled) await AgeVerifier.compile();
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
    zkApp = new AgeVerifier(zkAppAddress);
  });

  async function localDeploy() {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount);
      zkApp.deploy();
    });
    await txn.prove(); //goes through your transaction, and creates proofs for all the account updates that came from method calls
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send();
  }

  it('generates and deploys the `AgeVerifier` smart contract', async () => {
    await localDeploy();
    const num = zkApp.ageLimit.get();
    expect(num).toEqual(Field(18));
  });

  it('correctly updates the num state on the `AgeVerifier` smart contract', async () => {
    await localDeploy();

    // update transaction
    const txn = await Mina.transaction(senderAccount, () => {
      zkApp.verifyAge(Field(20), Field(21));
    });
    await txn.prove();
    await txn.sign([senderKey]).send();

    const updatedNum = zkApp.ageLimit.get();
    expect(updatedNum).toEqual(Field(21));
  });

  it('correctly failes when the person is younger than the agelimit ', async () => {
    await localDeploy();

    // update transaction
    try{
      const txn = await Mina.transaction(senderAccount, () => {
        zkApp.verifyAge(Field(16), Field(20));
      });
      await txn.prove();
      await txn.sign([senderKey]).send();
    }catch(e){
      console.log(e)
    }
    

    const updatedNum = zkApp.ageLimit.get();
    expect(updatedNum).toEqual(Field(18));
  });

  it('correctly failes when the person tries to update the ageLimit to a number that is too low ', async () => {
    await localDeploy();

    // update transaction
    try{
      const txn = await Mina.transaction(senderAccount, () => {
        zkApp.verifyAge(Field(18), Field(16));
      });
      await txn.prove();
      await txn.sign([senderKey]).send();
    }catch(e){
      console.log(e)
    }
    

    const updatedNum = zkApp.ageLimit.get();
    expect(updatedNum).toEqual(Field(18));
  });
});
