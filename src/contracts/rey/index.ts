import Contract, { TransactionOptions } from "web3-eth-contract";
import { Request } from "../../structs";

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

  public async getPastTransactions(subject: string): Promise<any> {
    // FIXME fromBlock should be rey creation
    const events = await this.contract.getPastEvents("Cashout", {fromBlock: 0, filter: {subject}});
    return events.map((event) => event.returnValues.transaction); // TODO paginate
  }

  public async cashout(...args: any[]) {
    throw new Error("This method is not yet implemented");
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
