import { reyHash } from "../utils";

export default function MetamaskPersonalSignStrategy() {
  const web3CurrentProvider = getMetamaskProvider();
  return async (...data: any[]) => {
    const account = (await getAccounts(web3CurrentProvider))[0];
    if (!account) {
      throw new Error("No default account selected for metamask");
    }
    const msg = reyHash(data);
    const signature = await personalSign(web3CurrentProvider, msg, account);
    if (typeof signature === "undefined") {
      throw new Error("User denied message signature.");
    } else {
      return signature;
    }
  };
}

function getMetamaskProvider(): any {
  const w: any = window; // This allows us to inspect the window ignoring the typescript typechecking
  if (!w.web3 || !w.web3.currentProvider) {
    throw new TypeError("no global web3 provider found");
  } else if (w.web3.currentProvider.isMetaMask !== true) {
    throw new TypeError("global web3 provider is not MetaMask");
  }
  return w.web3.currentProvider;
}

function getAccounts(provider: any): Promise<string[]> {
  return sendAsync<string[]>(provider, {
    method: "eth_accounts",
    params: [],
  });
}

function personalSign(provider: any, data: string, from: string): Promise<string> {
  return sendAsync<string>(provider, {
    method: "personal_sign",
    params: [data, from],
  });
}

function sendAsync<T>(provider: any, methodCall: any): Promise<T> {
  return new Promise((resolve, reject) => {
    provider.sendAsync(methodCall,
      (err: any, res: any) => err ? reject(err) : resolve(res.result),
    );
  });
}
