import axios, { AxiosInstance } from "axios";
import Contract, { DevelopmentContract } from "../contracts";
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

  async manifestUrl(): Promise<string|null> {
    const manifestUrl = await this.opts.contract.getEntry(this.address);
    return manifestUrl || null;
  }

  async manifest(): Promise<AppManifest|null> {
    if (this.opts.manifestCache.has(this.address)) {
      return this.opts.manifestCache.get(this.address)!;
    }
    const manifestUrl = await this.manifestUrl();
    if (!manifestUrl) {
      return null;
    }
    const res = await this.opts.http.get(manifestUrl);
    const manifest = res.data;
    // FIXME: Check `manifest` actually implements the AppManifest interface
    this.opts.manifestCache.set(this.address, manifest);
    return manifest;
  }

  async extraReadPermissions(): Promise<PartialReadPermission[]> {
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
      })
    );
    return [
      ...directDependencies,
      ...(childDependencies.reduce((v, c) => v.concat(c), [])),
    ];
  }

  async query(params: AppParams) {
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
  contract?: Contract;
}
