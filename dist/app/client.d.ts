import { AxiosInstance } from "axios";
import Contract from "../contracts";
import { ManifestEntry } from "../contracts/registry";
import { AppParams } from "../structs";
import { AppManifest, PartialReadPermission } from "./types";
export default class AppClient {
    readonly address: string;
    private readonly opts;
    constructor(address: string, opts?: IAppClientOptions);
    manifestEntry(): Promise<ManifestEntry | null>;
    manifest(): Promise<AppManifest | null>;
    extraReadPermissions(): Promise<PartialReadPermission[]>;
    query(params: AppParams): Promise<any>;
    private getManifest;
}
export declare function buildOptions(opts: IAppClientOptions): Required<IAppClientOptions>;
interface IAppClientOptions {
    http?: AxiosInstance;
    manifestCache?: Map<string, AppManifest>;
    contract?: Contract;
}
export {};
