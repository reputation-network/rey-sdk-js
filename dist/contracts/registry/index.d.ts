import { TransactionOptions } from "web3-eth-contract";
import { Hash } from "../../types";
export default class RegistryContract {
    private readonly registry;
    private readonly ABI;
    constructor(provider: string, address: string, options?: TransactionOptions);
    getEntry(address: string): Promise<ManifestEntry>;
    setEntry(address: string, entry: ManifestEntry): Promise<void>;
}
export interface ManifestEntry {
    url: string;
    hash: Hash;
}
