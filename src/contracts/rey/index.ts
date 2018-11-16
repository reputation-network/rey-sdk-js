import Contract, { TransactionOptions } from "web3-eth-contract";
import { Request, Transaction } from "../../structs";

export default class ReyContract {
  private readonly contract: Contract;
  private readonly ABI = require("./abi").default;

  constructor(provider: string, address: string, options?: TransactionOptions) {
    Contract.setProvider(provider);
    this.contract = new Contract(this.ABI, address, options);
  }

  public async validateRequest(request: Request): Promise<boolean> {
    const arg = request.toABI();
    return this.contract.methods.validateRequest(arg).call();
  }

  public async getPastTransactions(subject: string): Promise<Transaction[]> {
    // FIXME fromBlock should be rey creation
    const events = await this.contract.getPastEvents("Cashout", {fromBlock: 0, filter: {subject}});
    return events.map((event) => new Transaction(event.returnValues.transaction)); // TODO paginate
  }

  public async cashout(transactions: Array<Transaction>) {
    const arg = transactions.map((t: Transaction) => t.toABI());
    await this.contract.methods.cashout(arg).send();
  }

  public async fund(...args: any[]) {
    throw new Error("This method is not yet implemented");
  }

  public async release(...args: any[]) {
    throw new Error("This method is not yet implemented");
  }

  public async balance(...args: any[]) {
    throw new Error("This method is not yet implemented");
  }
}
