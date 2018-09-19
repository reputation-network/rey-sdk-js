import Accounts from "web3-eth-accounts";
import sha3 from "web3-utils/src/soliditySha3";
import { SignStrategy } from "../types";
import { deepFlatten } from "../utils";

/**
 * Returns a sign strategy that signs data with the provided privateKey
 * @param privateKey
 */
export default function privateKeySignStrategyFactory(privateKey: string): SignStrategy {
  const accounts = new Accounts();
  const account = accounts.privateKeyToAccount(privateKey);
  return async (...data: any[]) => {
    const {signature} = account.sign(sha3(...deepFlatten(data)));
    return signature;
  };
}
