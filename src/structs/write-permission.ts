import { Address } from "../types";
import { extractIndexOrProperty, isAddress } from "../utils";
import SignatureV2 from "./signature";

export default class WritePermission {
  public readonly writer: Address;
  public readonly subject: Address;
  public readonly signature: SignatureV2;

  constructor(wp: any) {
    let idx = 0;
    this.writer = extractIndexOrProperty("writePermission", wp, idx++, "writer", isAddress);
    this.subject = extractIndexOrProperty("writePermission", wp, idx++, "subject", isAddress);
    const signature = extractIndexOrProperty("writePermission", wp, idx++, "signature");
    this.signature = new SignatureV2(signature);
    Object.freeze(this);
  }

  public toABI() {
    return [
      this.writer,
      this.subject,
      this.signature.toABI(),
    ];
  }
}
