declare module "crypto" {
  export function generateKeyPair(format: type, opts: any, callback: Function);

  export type Key = {
    publicKey: string;
    privateKey?: string;
  }
}
