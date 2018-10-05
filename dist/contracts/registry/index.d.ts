import { Hash } from "../../types";
export default class RegistryContract {
    private readonly registry;
    private readonly ABI;
    constructor(provider: string, address: string);
    getEntry(address: string): Promise<ManifestEntry>;
    setEntry(address: string, entry: ManifestEntry): Promise<void>;
}
export interface ManifestEntry {
    url: string;
    hash: Hash;
}
