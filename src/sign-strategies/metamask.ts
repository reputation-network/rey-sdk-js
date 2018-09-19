import soliditySha3 from "web3-utils/src/soliditySha3";
import { deepFlatten } from "../utils";

/**
 * Delegates the sign process into the metamask browser addon
 * @param data Data to be signed
 * @throws {TypeError} if no metamask instance is found on the window context
 */
export default async function metamaskSign(...data: any[]) {
  const provider = await getMetamaskProvider();
  const accounts = await getAccounts(provider);
  if (accounts.length === 0) {
    throw new Error("No accounts found on metamask");
  }
  const hash = soliditySha3(...deepFlatten(data));
  return signTypedData(
    provider,
    [{ type: "bytes", name: "REY Signature", value: hash }],
    accounts[0],
  );
}

type Provider = any; // FIXME: This should be a proper type
interface TypedData { type: string; name: string; value: string; }

function getMetamaskProvider(): Provider {
  const w: any = window; // This allows us to inspect the window ignoring the typescript typechecking
  if (!w.web3 || !w.web3.currentProvider) {
    throw new TypeError("no global web3 provider found");
  } else if (w.web3.currentProvider.isMetaMask !== true) {
    throw new TypeError("global web3 provider is not MetaMask");
  }
  return Promise.resolve(w.web3.currentProvider);
}

function sendAsync<T>(provider: Provider, methodCall: any): Promise<T>  {
  return new Promise((resolve, reject) => {
    provider.sendAsync(methodCall,
      (err: any, res: any) => err ? reject(err) : resolve(res.result),
    );
  });
}

function getAccounts(provider: Provider): Promise<string[]> {
  return sendAsync<string[]>(provider, {
    method: "eth_accounts",
    params: [],
  });
}

function signTypedData(provider: Provider, data: TypedData[], from: string): Promise<string> {
  return sendAsync(provider, {
    method: "eth_signTypedData",
    params: [data, from],
    from,
  });
}
