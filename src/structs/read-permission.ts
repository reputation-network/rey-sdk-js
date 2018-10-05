import { Address, Hash, RsvSignature } from "../types";
import { extractIndexOrProperty, isAddress, isHash, isNumeric, isSignature, normalizeSignature } from "../utils";

export default class ReadPermission {
  public readonly reader: Address;
  public readonly source: Address;
  public readonly subject: Address;
  public readonly manifest: Hash;
  public readonly expiration: string;
  public readonly signature: RsvSignature;

  constructor(rp: any) {
    let idx = 0;
    this.reader = extractIndexOrProperty("readPermission", rp, idx++, "reader", isAddress);
    this.source = extractIndexOrProperty("readPermission", rp, idx++, "source", isAddress);
    this.subject = extractIndexOrProperty("readPermission", rp, idx++, "subject", isAddress);
    this.manifest = extractIndexOrProperty("readPermission", rp, idx++, "manifest", isHash);
    this.expiration = extractIndexOrProperty("readPermission", rp, idx++, "expiration", isNumeric);
    const signature = extractIndexOrProperty("readPermission", rp, idx++, "signature", isSignature);
    this.signature = normalizeSignature(signature);
    Object.freeze(this);
  }

  public toABI() {
    return [
      this.reader,
      this.source,
      this.subject,
      this.manifest,
      this.expiration,
      this.signature,
    ];
  }
}
