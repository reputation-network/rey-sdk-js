import { Address } from "../types";
import Signature from "./signature";
import { extractIndexOrProperty, isAddress, isDefined, isNumeric } from "./utils";

export default class Session {
  public readonly subject: Address;
  public readonly verifier: Address;
  public readonly fee: string;
  public readonly nonce: string;
  public readonly signature: Signature;

  constructor(sess: any) {
    let idx = 0;
    const subject = extractIndexOrProperty<string>("session", sess, idx++, "subject", isAddress);
    this.subject = subject.toLowerCase();
    const verifier = extractIndexOrProperty<string>("session", sess, idx++, "verifier", isAddress);
    this.verifier = verifier.toLowerCase();
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
