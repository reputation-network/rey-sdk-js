export function genHex(byteLength: number, prefixed: boolean = true): string {
  const bytes = require("crypto").randomBytes(byteLength).toString("hex");
  return prefixed ? `0x${bytes}` : bytes;
}
