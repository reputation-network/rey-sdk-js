import Accounts from "web3-eth-accounts";
import { SignStrategy } from "../types";
import { reyHash } from "../utils";

/**
 * Returns a sign strategy that signs data with the provided privateKey
 * @param privateKey
 */
export default function privateKeySignStrategyFactory(privateKey: string): SignStrategy {
  const accounts = new Accounts();
  const account = accounts.privateKeyToAccount(privateKey);
  return async (...data: any[]) => {
    const msg = reyHash(data);
    const {signature} = account.sign(msg);
    return signature;
  };
}
