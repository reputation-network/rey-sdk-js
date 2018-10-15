import { AxiosInstance } from "axios";
import RegistryContract, { ManifestEntry } from "../contracts/registry";
import { AppParams } from "../structs";
import { AppManifest, Address, PartialReadPermission } from "./types";
export default class AppClient {
    readonly address: string;
    private readonly opts;
    constructor(address: string, opts?: IAppClientOptions);
    manifestEntry(address?: Address): Promise<ManifestEntry>;
    manifest(address?: Address): Promise<AppManifest>;
    extraReadPermissions(): Promise<PartialReadPermission[]>;
    query(params: AppParams): Promise<any>;
    private getManifest;
}
export declare function buildOptions(opts: IAppClientOptions): Required<IAppClientOptions>;
interface IAppClientOptions {
    http?: AxiosInstance;
    manifestEntryCache?: Map<Address, ManifestEntry>;
    manifestCache?: Map<Address, AppManifest>;
    contract?: RegistryContract;
}
export {};
