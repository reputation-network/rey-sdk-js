declare module "crypto" {
  export function generateKeyPair(format: string, opts: any, callback: Function): Promise<Key>;

  export type Key = {
    publicKey: string;
    privateKey?: string;
  }
}
