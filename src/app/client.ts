import axios, { AxiosInstance } from "axios";
import { Buffer } from "safe-buffer";
import { sha3 } from "web3-utils";
import { DevelopmentContract } from "../contracts";
import RegistryContract, { ManifestEntry } from "../contracts/registry";
import { AppParams } from "../structs";
import { encodeUnsignedJwt } from "../utils";
import { AppManifest, PartialReadPermission } from "./types";

export default class AppClient {
  public readonly address: string;
  private readonly opts: Required<IAppClientOptions>;

  constructor(address: string, opts: IAppClientOptions = {}) {
    this.address = address;
    this.opts = buildOptions(opts);
  }

  public async manifestEntry(): Promise<ManifestEntry|null> {
    const entry = await this.opts.contract.getEntry(this.address);
    return entry.url ? entry : null;
  }

  public async manifest(): Promise<AppManifest|null> {
    if (this.opts.manifestCache.has(this.address)) {
      return this.opts.manifestCache.get(this.address)!;
    }
    const entry = await this.manifestEntry();
    if (!entry) {
      return null;
    }
    const manifest = await this.getManifest(entry);
    // FIXME: Check `manifest` actually implements the AppManifest interface
    this.opts.manifestCache.set(this.address, manifest);
    return manifest;
  }

  public async extraReadPermissions(): Promise<PartialReadPermission[]> {
    const manifest = await this.manifest();
    if (!manifest) {
      throw new Error(`No manifest record found for ${this.address}`);
    }
    const directDependencies = manifest.app_dependencies.map(
      (dep) => ({ reader: manifest.address, source: dep }));
    const childDependencies = await Promise.all(
      // FIXME: There is a risk of infinite recursion error here,
      //        should we handle that scenario? how?
      manifest.app_dependencies.map((dep: string) => {
        const depClient = new AppClient(dep, this.opts);
        return depClient.extraReadPermissions();
      }),
    );
    return [
      ...directDependencies,
      ...(childDependencies.reduce((v, c) => v.concat(c), [])),
    ];
  }

  public async query(params: AppParams) {
    const manifest = await this.manifest();
    if (!manifest) {
      throw new Error(`No manifest record found for ${this.address}`);
    }
    const appReadToken = encodeUnsignedJwt(params);
    const res = await this.opts.http.get(manifest.app_url, {
      headers: { authorization: `bearer ${appReadToken}` },
    });
    return res.data;
  }

  private async getManifest(manifestEntry: ManifestEntry) {
    const res = await this.opts.http.get(manifestEntry.url, { responseType: "arraybuffer" });
    const dataBuffer = Buffer.from(res.data);
    const responseHash = sha3(dataBuffer as any);
    if (responseHash !== manifestEntry.hash) {
      throw new Error(`Manifest hash check failed for ${this.address}`);
    }
    try {
      return JSON.parse(dataBuffer.toString("utf8"));
    } catch (e) {
      throw new Error(`Manifest parsing failed for ${this.address}`);
    }
  }
}

export function buildOptions(opts: IAppClientOptions): Required<IAppClientOptions> {
  return Object.assign({
    http: axios.create(),
    manifestCache: new Map(),
    contract: DevelopmentContract(),
  }, opts);
}

interface IAppClientOptions {
  http?: AxiosInstance;
  manifestCache?: Map<string, AppManifest>;
  contract?: RegistryContract;
}
