import axios, { AxiosInstance } from "axios";
import { Buffer } from "safe-buffer";
import { sha3 } from "web3-utils";
import { DevelopmentContract } from "../contracts";
import RegistryContract, { ManifestEntry } from "../contracts/registry";
import { AppParams } from "../structs";
import { SignStrategy } from "../types";
import { normalizeSignature, reyHash } from "../utils";
import { encodeUnsignedJwt } from "../utils";
import { validateSignature } from "../utils/struct-validations";
import { Address, AppManifest, PartialReadPermission } from "./types";

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
    const manifest = await this.getManifest(entry);
    // FIXME: Check `manifest` actually implements the AppManifest interface
    this.opts.manifestCache.set(address, manifest);
    return manifest;
  }

  public async extraReadPermissions(): Promise<PartialReadPermission[]> {
    const manifestEntry = await this.manifestEntry();
    const manifest = await this.manifest();
    if (!manifest) {
      throw new Error(`Could not retrieve manifest for app ${this.address}`);
    }
    const directDependencies = manifest.app_dependencies.map((dep) => {
      return { reader: manifest.address, source: dep,
        manifest: manifestEntry.hash };
    });
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

  public async query(params: AppParams) {
    const manifest = await this.manifest(params.request.session.verifier);
    const appReadToken = encodeUnsignedJwt(params);
    if (!manifest.verifier_url) {
      throw new Error(`Missing verifier_url for address ${manifest.address}`);
    }
    const res = await this.opts.http.get(manifest.verifier_url, {
      headers: { authorization: `bearer ${appReadToken}` },
      responseType: "arraybuffer",
    });
    const output = Buffer.from(res.data).toString();
    if (params.encryptionKey) { // FIXME: Make encryption mandatory once encryption key is required
      const signatureHeader = res.headers["x-app-signature"];
      if (!signatureHeader) { throw new Error("Missing app signature in response"); }
      const signature = JSON.parse(Buffer.from(signatureHeader, "base64").toString());
      validateSignature(reyHash([output]), normalizeSignature(signature), params.request.readPermission.source);
      return params.encryptionKey.decrypt(JSON.parse(output));
    }
    return JSON.parse(output);
  }

  private async getManifest(manifestEntry: ManifestEntry) {
    const res = await this.opts.http.get(manifestEntry.url, { responseType: "arraybuffer" });
    const dataBuffer = Buffer.from(res.data);
    const responseHash = sha3(dataBuffer as any);
    if (responseHash !== manifestEntry.hash) {
      throw new Error(`Manifest hash check failed for ${manifestEntry.url}`);
    }
    try {
      return JSON.parse(dataBuffer.toString("utf8"));
    } catch (e) {
      throw new Error(`Manifest parsing failed for ${manifestEntry.url}`);
    }
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
