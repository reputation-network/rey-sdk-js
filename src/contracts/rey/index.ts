import Contract, { TransactionOptions } from "web3-eth-contract";
import Personal from "web3-eth-personal";
import { Request, Transaction } from "../../structs";

export default class ReyContract {
  private readonly contract: Contract;
  private readonly personal: Personal;
  private readonly ABI = require("./abi").default;

  constructor(provider: string, address: string, options?: TransactionOptions) {
    Contract.setProvider(provider);
    this.contract = new Contract(this.ABI, address, options);
    this.personal = new Personal(provider);
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

  public async cashout(address: string, password: string, transactions: Transaction[]): Promise<void> {
    await this.personal.unlockAccount(address, password, 60);
    const arg = transactions.map((t: Transaction) => t.toABI());
    return this.contract.methods.cashout(arg).send({ from: address });
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
