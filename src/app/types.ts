import { Address, Hash } from "../types";

interface AppManifest {
  version: string;
  name: string;
  description: string;
  picture_url: string;
  address: Address;
  verifier_url: string;
  verifier_fee: number;
  app_url: string;
  app_callback_url: string;
  app_reward: number;
  app_schema: any;
  app_dependencies: Address[];
}

interface PartialReadPermission {
  source: Address;
  manifest: Hash;
  reader: Address;
}

export {
  Address,
  AppManifest,
  Hash,
  PartialReadPermission,
};
