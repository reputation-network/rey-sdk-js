import { extractIndexOrProperty } from "../utils";
import Session from "./session";
import SignatureV2 from "./signature";
import WritePermission from "./write-permission";

export default class Proof {
  public readonly writePermission: WritePermission;
  public readonly session: Session;
  public readonly signature: SignatureV2;

  constructor(proof: any) {
    let idx = 0;
    const writePermission = extractIndexOrProperty("proof", proof, idx++, "writePermission");
    this.writePermission = new WritePermission(writePermission);
    const session = extractIndexOrProperty("proof", proof, idx++, "session");
    this.session = new Session(session);
    const signature = extractIndexOrProperty("proof", proof, idx++, "signature");
    this.signature = new SignatureV2(signature);
    Object.freeze(this);
  }

  public toABI() {
    return [
      this.writePermission.toABI(),
      this.session.toABI(),
      this.signature.toABI(),
    ];
  }
}
