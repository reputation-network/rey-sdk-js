import Contract from "web3-eth-contract";
import { Hash } from "../../types";

export default class RegistryContract {
  private readonly registry: Contract;
  private readonly ABI = require("./abi").default;

  constructor(provider: string, address: string) {
    Contract.setProvider(provider);
    this.registry = new Contract(this.ABI, address);
  }

  public async getEntry(address: string): Promise<ManifestEntry> {
    const result = await this.registry.methods.getEntry(address).call();
    return { url: result[0], hash: result[1] };
  }

  public setEntry(address: string, entry: ManifestEntry): Promise<void> {
    return this.registry.methods.setEntry(entry.url, entry.hash).send({ from: address });
  }
}

export interface ManifestEntry {
  url: string;
  hash: Hash;
}
