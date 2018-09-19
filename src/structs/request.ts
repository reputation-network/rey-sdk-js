import { RsvSignature } from "../types";
import { extractIndexOrProperty, isNumeric, isSignature, normalizeSignature } from "../utils";
import ReadPermission from "./read-permission";
import Session from "./session";

export default class Request {
  public readonly readPermission: ReadPermission;
  public readonly session: Session;
  public readonly counter: string;
  public readonly value: string;
  public readonly signature: RsvSignature;

  constructor(req: any) {
    let idx = 0;
    const readPermission = extractIndexOrProperty("request", req, idx++, "readPermission");
    this.readPermission = new ReadPermission(readPermission);
    const session = extractIndexOrProperty("request", req, idx++, "session");
    this.session = new Session(session);
    this.counter = extractIndexOrProperty("request", req, idx++, "counter", isNumeric);
    this.value = extractIndexOrProperty("request", req, idx++, "value", isNumeric);
    const signature = extractIndexOrProperty("request", req, idx++, "signature", isSignature);
    this.signature = normalizeSignature(signature);
    Object.freeze(this);
  }

  public toABI() {
    return [
      this.readPermission.toABI(),
      this.session.toABI(),
      this.counter,
      this.value,
      this.signature,
    ];
  }
}
