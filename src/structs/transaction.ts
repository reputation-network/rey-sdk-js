import Proof from "./proof";
import Request from "./request";
import Signature from "./signature";
import { extractIndexOrProperty } from "./utils";

export default class Transaction {
  public readonly request: Request;
  public readonly proof: Proof;
  public readonly signature: Signature;

  constructor(tx: any) {
    let idx = 0;
    const request = extractIndexOrProperty("transaction", tx, idx++, "request");
    this.request = new Request(request);
    const proof = extractIndexOrProperty("transaction", tx, idx++, "proof");
    this.proof = new Proof(proof);
    const signature = extractIndexOrProperty("transaction", tx, idx++, "signature");
    this.signature = new Signature(signature);
    Object.freeze(this);
  }

  public toABI() {
    return [
      this.request.toABI(),
      this.proof.toABI(),
      this.signature.toABI(),
    ];
  }
}
