declare module "web3-eth-contract" {
  interface TransactionOptions {
    from?: string;
    gasPrice?: string;
    gas?: number;
    value?: number;
  }
  interface Transaction {
    call<T= any>(opts?: TransactionOptions): Promise<T>;
    send<T= any>(opts?: TransactionOptions): Promise<T>;
    estimateGas<T= any>(opts?: TransactionOptions): Promise<T>;
    encodeABI(): string;
  }
  interface GetPastEventsOptions {
    filter: { [field: string]: Array<number|string>|number|string };
    fromBlock?: number;
    toBlock?: number;
    topics?: string[];
  }
  interface Event<R> {
    event: string;
    signature: string|null;
    address: string;
    returnValues: R;
    logIndex: number;
    transactionIndex: number;
    transactionHash: string;
    blockHash: string|null;
    blockNumber: number|null;
    raw: {
      data: string;
      topics: string[];
    };
  }
  class Contract {
    public static setProvider(provider: string): void;
    public methods: { [method: string]: (...args: any[]) => Transaction };
    constructor(abi: any, address?: string, opts?: TransactionOptions);
    public getPastEvents<R= any>(event: string, options?: GetPastEventsOptions): Promise<Array<Event<R>>>;
  }
  export default Contract;
  export {
    TransactionOptions,
    Transaction,
    Event,
  };
}
