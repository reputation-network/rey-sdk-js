declare module "web3-utils/src/soliditySha3" {
  interface TV { t: string; v: number|string; }
  interface TypeValue { type: string; value: number|string; }
  export default function soliditySha3(...args: Array<number|string|TV|TypeValue>): string;
}

declare module "web3-utils" {
  export function bytesToHex(mixed: any): string;
  export function toHex(mixed: any): string;
  export function utf8ToHex(mixed: any): string;
  export function toChecksumAddress(address: string): string;
  export function sha3(buffer: Buffer): string;
}
