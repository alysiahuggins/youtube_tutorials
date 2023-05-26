import { Field, SmartContract, state, State, method } from 'snarkyjs';

/**
 * Basic Example
 * See https://docs.minaprotocol.com/zkapps for more info.
 *
 * The Add contract initializes the state variable 'num' to be a Field(1) value by default when deployed.
 * When the 'update' method is called, the Add contract adds Field(2) to its 'num' contract state.
 *
 * This file is safe to delete and replace with your own contract.
 */
export class AgeVerifier extends SmartContract {
  @state(Field) ageLimit = State<Field>();

  init(){
    this.ageLimit.set(Field(18));
  }

  @method verifyAge(userAge: Field, ageLimitUpdate: Field){
    const currentAgeLimit = this.ageLimit.getAndAssertEquals();

    userAge.assertGreaterThanOrEqual(currentAgeLimit);
    ageLimitUpdate.assertGreaterThanOrEqual(Field(18));
    
    this.ageLimit.set(ageLimitUpdate);

  }
}
