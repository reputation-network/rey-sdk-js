import { HexString } from "../types";
import { parseSignature, toAbiSignature, toRpcSignature, toRsvSignature } from "./utils";

export default class Signature {
  public readonly r: HexString<32>;
  public readonly s: HexString<32>;
  public readonly v: HexString<1>;

  constructor(signature: any) {
    const {r, s, v} = parseSignature(signature);
    this.r = r;
    this.s = s;
    this.v = v;
    Object.freeze(this);
  }

  public toABI() {
    return toAbiSignature(this);
  }

  public toRSV() {
    return toRsvSignature(this);
  }

  public toRPC() {
    return toRpcSignature(this);
  }

  public toString() { return this.toRPC(); }
  public toJSON(key: any) { return key === "" ? this.toRSV() : this.toRPC(); }
}
