declare module "web3-eth-personal" {
  export default class Personal {
    constructor(provider?: any);
    public getAccounts(): Promise<string>;
    public newAccount(password: string): Promise<string>;
    public unlockAccount(account: string, password: string, duration: number): Promise<void>;
    public lockAccount(account: string): Promise<void>;
    public sign(data: string, account: string, password: string): Promise<string>;
  }
}
