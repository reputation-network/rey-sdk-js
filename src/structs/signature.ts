import { HexString } from "../types";
import { extractIndexOrProperty, isHexString, isNumeric } from "../utils";

export default class SignatureV2 {
  public readonly r: HexString<32>;
  public readonly s: HexString<32>;
  public readonly v: HexString<1>;

  constructor(signature: any) {
    let idx = 0;
    signature = isHexString(signature, 65) ? this.parseRPC(signature) : signature;
    this.r = extractIndexOrProperty("signature", signature, idx++, "r", (r) => isHexString(r, 32));
    this.s = extractIndexOrProperty("signature", signature, idx++, "s", (s) => isHexString(s, 32));
    const vTemp = extractIndexOrProperty("signature", signature, idx++, "v", (v) => isHexString(v, 1) || isNumeric(v));
    this.v = isHexString(vTemp, 1) ? vTemp : `0x${vTemp.toString(16)}`;
    Object.freeze(this);
  }

  public toABI() {
    const { r, s, v } = this;
    return [r, s, v];
  }

  public toRSV() {
    const { r, s, v } = this;
    return { r, s, v };
  }

  public toRPC() {
    const { r, s, v } = this;
    return `0x${[r, s, v].map((p) => p.replace(/^0x/, "")).join("")}`;
  }

  private parseRPC(signature: any) {
    const [, r, s, v] = /^0x(.{64})(.{64})(.{2})$/.exec(signature)!;
    return [`0x${r}`, `0x${s}`, `0x${v}`];
  }
}
