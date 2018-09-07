import { Address, RsvSignature } from "../types";
import { extractIndexOrProperty, isAddress, isNumeric, isSignature, normalizeSignature } from "../utils";

export default class Session {
  public readonly subject: Address;
  public readonly verifier: Address;
  public readonly fee: string;
  public readonly nonce: string;
  public readonly signature: RsvSignature;

  constructor(sess: any) {
    let idx = 0;
    this.subject = extractIndexOrProperty("session", sess, idx++, "subject", isAddress);
    this.verifier = extractIndexOrProperty("session", sess, idx++, "verifier", isAddress);
    this.fee = extractIndexOrProperty("session", sess, idx++, "fee", isNumeric);
    this.nonce = extractIndexOrProperty("session", sess, idx++, "nonce", isNumeric);
    const signature = extractIndexOrProperty("session", sess, idx++, "signature", isSignature);
    this.signature = normalizeSignature(signature);
    Object.freeze(this);
  }

  public toABI() {
    return [
      this.subject,
      this.verifier,
      this.fee,
      this.nonce,
      this.signature,
    ];
  }
}
