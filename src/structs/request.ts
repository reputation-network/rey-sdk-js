import { extractIndexOrProperty, isNumeric } from "../utils";
import ReadPermission from "./read-permission";
import Session from "./session";
import Signature from "./signature";

export default class Request {
  public readonly readPermission: ReadPermission;
  public readonly session: Session;
  public readonly counter: string;
  public readonly value: string;
  public readonly signature: Signature;

  constructor(req: any) {
    let idx = 0;
    const readPermission = extractIndexOrProperty("request", req, idx++, "readPermission");
    this.readPermission = new ReadPermission(readPermission);
    const session = extractIndexOrProperty("request", req, idx++, "session");
    this.session = new Session(session);
    const counter = extractIndexOrProperty("request", req, idx++, "counter", isNumeric);
    this.counter = `${counter}`;
    const value = extractIndexOrProperty("request", req, idx++, "value", isNumeric);
    this.value = `${value}`;
    const signature = extractIndexOrProperty("request", req, idx++, "signature");
    this.signature = new Signature(signature);
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
