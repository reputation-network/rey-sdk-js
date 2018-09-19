declare module "web3-eth-accounts" {
  export interface Signature {
    message: string;
    messageHash: string;
    v: string;
    r: string;
    s: string;
    signature: string;
  }
  export interface Account {
    readonly address: string;
    readonly privateKey: string;
    sign: (data: string) => Signature;
  }
  export default class Accounts {
    constructor(provider?: any);
    public create(entropy?: string): Account;
    public privateKeyToAccount(privateKey: string): Account;
  }
}
