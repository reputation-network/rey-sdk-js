import { Address, RsvSignature } from "../types";
import { extractIndexOrProperty, isAddress, isSignature, normalizeSignature } from "../utils";

export default class WritePermission {
  public readonly writer: Address;
  public readonly subject: Address;
  public readonly signature: RsvSignature;

  constructor(wp: any) {
    let idx = 0;
    this.writer = extractIndexOrProperty("writePermission", wp, idx++, "writer", isAddress);
    this.subject = extractIndexOrProperty("writePermission", wp, idx++, "subject", isAddress);
    const signature = extractIndexOrProperty("writePermission", wp, idx++, "signature", isSignature);
    this.signature = normalizeSignature(signature);
    Object.freeze(this);
  }

  public toABI() {
    return [
      this.writer,
      this.subject,
      this.signature,
    ];
  }
}
