import { TransactionOptions } from "web3-eth-contract";
import { Request, Transaction } from "../../structs";
export default class ReyContract {
    private readonly contract;
    private readonly personal;
    private readonly ABI;
    constructor(provider: string, address: string, options?: TransactionOptions);
    validateRequest(request: Request): Promise<boolean>;
    getPastTransactions(subject: string): Promise<Transaction[]>;
    cashout(address: string, password: string, transactions: Transaction[]): Promise<void>;
    fund(...args: any[]): Promise<void>;
    release(...args: any[]): Promise<void>;
    balance(...args: any[]): Promise<void>;
}
