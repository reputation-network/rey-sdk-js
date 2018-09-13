declare module "web3-eth-contract" {
  interface TransactionOptions {
    from?: string;
    gasPrice?: string;
    gas?: number;
    value?: number;
  }
  interface Transaction {
    call<T=any>(opts?: TransactionOptions): Promise<T>;
    send<T=any>(opts?: TransactionOptions): Promise<T>;
    estimateGas<T=any>(opts?: TransactionOptions): Promise<T>;
    encodeABI(): string;
  }
  class Contract {
    static setProvider(provider: string): void;
    constructor(abi: any, address?: string, opts?: TransactionOptions);
    methods: { [method: string]: (...args: any[]) => Transaction };
  }
  export default Contract
}
