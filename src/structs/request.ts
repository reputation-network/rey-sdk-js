import { extractIndexOrProperty, isNumeric } from "../utils";
import ReadPermission from "./read-permission";
import Session from "./session";
import SignatureV2 from "./signature";

export default class Request {
  public readonly readPermission: ReadPermission;
  public readonly session: Session;
  public readonly counter: string;
  public readonly value: string;
  public readonly signature: SignatureV2;

  constructor(req: any) {
    let idx = 0;
    const readPermission = extractIndexOrProperty("request", req, idx++, "readPermission");
    this.readPermission = new ReadPermission(readPermission);
    const session = extractIndexOrProperty("request", req, idx++, "session");
    this.session = new Session(session);
    this.counter = extractIndexOrProperty("request", req, idx++, "counter", isNumeric);
    this.value = extractIndexOrProperty("request", req, idx++, "value", isNumeric);
    const signature = extractIndexOrProperty("request", req, idx++, "signature");
    this.signature = new SignatureV2(signature);
    Object.freeze(this);
  }

  public toABI() {
    return [
      this.readPermission.toABI(),
      this.session.toABI(),
      this.counter,
      this.value,
      this.signature.toABI(),
    ];
  }
}
