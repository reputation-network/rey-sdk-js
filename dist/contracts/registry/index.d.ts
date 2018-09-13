export default class RegistryContract {
    private readonly registry;
    private readonly ABI;
    constructor(provider: string, address: string);
    getEntry(address: string): Promise<string>;
    setEntry(address: string, manifestUrl: string): Promise<void>;
}
