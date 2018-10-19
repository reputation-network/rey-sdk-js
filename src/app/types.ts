import { Address, Hash, Signature } from "../types";

export { Address, Hash, Signature };

export interface AppManifest {
  version: string;
  name: string;
  description: string;
  address: Address;
  verifier_url: string;
  verifier_fee: number;
  app_url: string;
  app_reward: number;
  app_schema: any;
  app_dependencies: Address[];
}

export interface PartialReadPermission {
  source: Address;
  manifest: Hash;
  reader: Address;
}

export interface UnsignedReadPermission {
  subject: Address;
  source: Address;
  reader: Address;
  expiration: string;
  signature?: Signature;
}

export interface UnsignedSession {
  subject: Address;
  verifier: Address;
  fee: string;
  nonce: string;
  signature?: Signature;
}

export interface UnsignedRequest<R= UnsignedReadPermission, S= UnsignedSession> {
  readPermission: R;
  session: S;
  value: string;
  counter: string;
  signature?: Signature;
}

export interface UnsignedAppParams<R= UnsignedReadPermission, S= UnsignedSession> {
  version: string;
  request: UnsignedRequest<R, S>;
  extraReadPermissions: R[];
}

export interface UnsignedWritePermission {
  writer: string;
  subject: string;
  signature?: Signature;
}

export interface WithRequestHash {
  request: { hash: string };
}
