import { Address, Signature } from "../types";

export { Address, Signature }

export interface AppManifest {
  version: string;
  name: string;
  description: string;
  address: Address;
  verifier_url: string;
  verifier_fee: number;
  app_url: string;
  app_reward: number;
  app_schema: string;
  app_dependencies: Address[];
}

export interface PartialReadPermission {
  source: Address;
  reader: Address;
}

export interface UnsignedReadPermission {
  subject: Address,
  source: Address,
  reader: Address,
  expiration: string,
  signature?: Signature,
}

export interface UnsignedSession {
  subject: Address,
  verifier: Address,
  fee: string,
  nonce: string,
  signature?: Signature,
}

export interface UnsignedRequest<R=UnsignedReadPermission, S=UnsignedSession> {
  readPermission: R;
  session: S;
  value: string;
  counter: string;
  signature?: Signature;
}

export interface UnsignedAppParams<R=UnsignedReadPermission, S=UnsignedSession> {
  version: string;
  request: UnsignedRequest<R, S>;
  extraReadPermissions: R[];
}

export interface WithRequestHash {
  request: { hash: string }
}