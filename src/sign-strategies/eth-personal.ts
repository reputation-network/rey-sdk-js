import Personal from "web3-eth-personal";
import { SignStrategy } from "../types";
import { reyHash } from "../utils";

/**
 * Uses the given provider to personally sign data. If no account address provider
 * is passed, it will use the first account available. If no password provider is
 * passed, password defaults to an empty string.
 * @param provider
 * @param account
 * @param password
 */
export default function EthPersonalSignStrategy(
  provider: Provider,
  account: AsyncProvider = "",
  password: AsyncProvider<[string]> = "",
): SignStrategy {
  const personal = new Personal(provider);
  return async (...data: any[]) => {
    const acc = await (account
      ? getAsync(account)
      : personal.getAccounts().then((a) => a[0]));
    const pswd = await getAsync(password, acc);
    const message = reyHash(data);
    const signature = await personal.sign(message, acc, pswd);
    return signature;
  };
}

function getAsync<T extends A[], A>(provider: AsyncProvider<T>, ...providerArgs: any[]): Promise<string> {
  return typeof provider === "function"
    ? Promise.resolve(provider())
    : Promise.resolve(provider);
}

type Provider = string | any; // FIXME: Specify a valid ethereum provider interface
type AsyncProvider<T extends A[]= [], A= any> =
  | string
  | Promise<string>
  | ((...args: T) => string)
  | ((...args: T) => Promise<string>);
