import { Address } from "../types";
import Signature from "./signature";
import { extractIndexOrProperty, isAddress } from "./utils";

export default class WritePermission {
  public readonly writer: Address;
  public readonly subject: Address;
  public readonly signature: Signature;

  constructor(wp: any) {
    let idx = 0;
    const writer = extractIndexOrProperty<string>("writePermission", wp, idx++, "writer", isAddress);
    this.writer = writer.toLowerCase();
    const subject = extractIndexOrProperty<string>("writePermission", wp, idx++, "subject", isAddress);
    this.subject = subject.toLowerCase();
    const signature = extractIndexOrProperty("writePermission", wp, idx++, "signature");
    this.signature = new Signature(signature);
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
