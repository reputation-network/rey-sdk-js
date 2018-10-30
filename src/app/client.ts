import axios, { AxiosInstance } from "axios";
import { DevelopmentContract } from "../contracts";
import RegistryContract, { ManifestEntry } from "../contracts/registry";
import AppParams from "./params";
import { AppResponse } from "./response";
import { Address, AppManifest, PartialReadPermission } from "./types";
import { encodeUnsignedJwt, getManifestWithEntry } from "./utils";

export default class AppClient {
  public readonly address: string;
  private readonly opts: Required<IAppClientOptions>;

  constructor(address: string, opts: IAppClientOptions = {}) {
    this.address = address;
    this.opts = buildOptions(opts);
  }

  public async manifestEntry(address: Address = this.address): Promise<ManifestEntry> {
    if (this.opts.manifestEntryCache.has(address)) {
      return this.opts.manifestEntryCache.get(address)!;
    }
    const entry = await this.opts.contract.getEntry(address);
    if (entry && entry.url) {
      this.opts.manifestEntryCache.set(address, entry);
      return entry;
    } else {
      throw new Error(`No manifest entry found for ${address}`);
    }
  }

  public async manifest(address: Address = this.address): Promise<AppManifest> {
    if (this.opts.manifestCache.has(address)) {
      return this.opts.manifestCache.get(address)!;
    }
    const entry = await this.manifestEntry(address);
    const manifest = await this._getManifest(entry);
    // FIXME: Check `manifest` actually implements the AppManifest interface
    this.opts.manifestCache.set(address, manifest);
    return manifest;
  }

  public async extraReadPermissions(): Promise<PartialReadPermission[]> {
    const manifest = await this.manifest();
    if (!manifest) {
      throw new Error(`Could not retrieve manifest for app ${this.address}`);
    }
    const directDependencies = await Promise.all(
      manifest.app_dependencies.map(async (dep) => {
        const depClient = new AppClient(dep, this.opts);
        const depManifestEntry = await depClient.manifestEntry();
        return { reader: manifest.address, source: dep,
          manifest: depManifestEntry.hash };
      }),
    );
    const childDependencies = await Promise.all(
      // FIXME: There is a risk of infinite recursion error here,
      //        handle using client cache
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

  public async query<T = any>(params: AppParams): Promise<AppResponse<T>> {
    const manifest = await this.manifest(params.request.session.verifier);
    const appReadToken = encodeUnsignedJwt(params);
    if (!manifest.verifier_url) {
      throw new Error(`Missing verifier_url for address ${manifest.address}`);
    }
    const res = await this.opts.http.get(manifest.verifier_url, {
      headers: { authorization: `bearer ${appReadToken}` },
      responseType: "arraybuffer",
    });
    const appRes = await AppResponse.fromEncryptedAppResponse(
      AppResponse.fromAxiosRespone(res),
      params.encryptionKey,
    );
    await appRes.validateSignature(params.request.readPermission.source);
    return appRes;
  }

  private async _getManifest(manifestEntry: ManifestEntry) {
    const { hash: expectedHash } = manifestEntry;
    const { manifest, hash: actualHash } = await getManifestWithEntry(
      manifestEntry.url, this.opts.http);
    if (expectedHash !== actualHash) {
      throw new Error(`Manifest hash check failed for ${manifestEntry.url}`);
    }
    return manifest;
  }
}

export function buildOptions(opts: IAppClientOptions): Required<IAppClientOptions> {
  return Object.assign({
    http: axios.create(),
    manifestEntryCache: new Map(),
    manifestCache: new Map(),
    contract: DevelopmentContract(),
  }, opts);
}

interface IAppClientOptions {
  http?: AxiosInstance;
  manifestEntryCache?: Map<Address, ManifestEntry>;
  manifestCache?: Map<Address, AppManifest>;
  contract?: RegistryContract;
}
