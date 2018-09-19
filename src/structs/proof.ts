import { RsvSignature } from "../types";
import { extractIndexOrProperty, isSignature, normalizeSignature } from "../utils";
import Session from "./session";
import WritePermission from "./write-permission";

export default class Proof {
  public readonly writePermission: WritePermission;
  public readonly session: Session;
  public readonly signature: RsvSignature;

  constructor(proof: any) {
    let idx = 0;
    const writePermission = extractIndexOrProperty("proof", proof, idx++, "writePermission");
    this.writePermission = new WritePermission(writePermission);
    const session = extractIndexOrProperty("proof", proof, idx++, "session");
    this.session = new Session(session);
    const signature = extractIndexOrProperty("proof", proof, idx++, "signature", isSignature);
    this.signature = normalizeSignature(signature);
    Object.freeze(this);
  }

  public toABI() {
    return [
      this.writePermission.toABI(),
      this.session.toABI(),
      this.signature,
    ];
  }
}
