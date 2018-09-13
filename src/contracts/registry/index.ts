import Contract from "web3-eth-contract";

export default class RegistryContract {
  private readonly registry: Contract;
  private readonly ABI = require("./abi.json");

  constructor(provider: string, address: string) {
    Contract.setProvider(provider);
    this.registry = new Contract(this.ABI, address);
  }

  getEntry(address: string): Promise<string> {
    return this.registry.methods.getEntry(address).call();
  }

  setEntry(address: string, manifestUrl: string): Promise<void> {
    return this.registry.methods.setEntry(manifestUrl).send({ from: address });
  }
}
