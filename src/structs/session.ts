import { Address } from "../types";
import { extractIndexOrProperty, isAddress, isDefined, isNumeric } from "../utils";
import Signature from "./signature";

export default class Session {
  public readonly subject: Address;
  public readonly verifier: Address;
  public readonly fee: string;
  public readonly nonce: string;
  public readonly signature: Signature;

  constructor(sess: any) {
    let idx = 0;
    this.subject = extractIndexOrProperty("session", sess, idx++, "subject", isAddress);
    this.verifier = extractIndexOrProperty("session", sess, idx++, "verifier", isAddress);
    const fee = extractIndexOrProperty("session", sess, idx++, "fee", isNumeric);
    this.fee = `${fee}`;
    const nonce = extractIndexOrProperty("session", sess, idx++, "nonce", isDefined);
    this.nonce = `${nonce}`;
    const signature = extractIndexOrProperty("session", sess, idx++, "signature");
    this.signature = new Signature(signature);
    Object.freeze(this);
  }

  public toABI() {
    return [
      this.subject,
      this.verifier,
      this.fee,
      this.nonce,
      this.signature.toABI(),
    ];
  }
}
