import { Address, Hash } from "../types";
import Signature from "./signature";
import { extractIndexOrProperty, isAddress, isHash, isNumeric } from "./utils";

export default class ReadPermission {
  public readonly reader: Address;
  public readonly source: Address;
  public readonly subject: Address;
  public readonly manifest: Hash;
  public readonly expiration: string;
  public readonly signature: Signature;

  constructor(rp: any) {
    let idx = 0;
    const reader = extractIndexOrProperty<string>("readPermission", rp, idx++, "reader", isAddress);
    this.reader = reader.toLowerCase();
    const source = extractIndexOrProperty<string>("readPermission", rp, idx++, "source", isAddress);
    this.source = source.toLowerCase();
    const subject = extractIndexOrProperty<string>("readPermission", rp, idx++, "subject", isAddress);
    this.subject = subject.toLowerCase();
    this.manifest = extractIndexOrProperty("readPermission", rp, idx++, "manifest", isHash);
    const expiration = extractIndexOrProperty("readPermission", rp, idx++, "expiration", isNumeric);
    this.expiration = `${expiration}`;
    const signature = extractIndexOrProperty("readPermission", rp, idx++, "signature");
    this.signature = new Signature(signature);
    Object.freeze(this);
  }

  public toABI() {
    return [
      this.reader,
      this.source,
      this.subject,
      this.manifest,
      this.expiration,
      this.signature.toABI(),
    ];
  }
}
