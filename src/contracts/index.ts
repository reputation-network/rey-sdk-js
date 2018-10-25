import { TransactionOptions } from "web3-eth-contract";
import RegistryContract from "./registry";
import ReyContract from "./rey";

type Provider = string|any; // FIXME: This should be a proper type
type ContractAddress = string | {registry: string, rey: string};

export type Contract = RegistryContract & ReyContract;

export default function SmartContract(
  provider: Provider,
  address: ContractAddress,
  options?: TransactionOptions,
) {
  const registry = new RegistryContract(provider,
    typeof address === "string" ? address : address.registry, options);
  const rey = new ReyContract(provider,
    typeof address === "string" ? address : address.rey, options);
  return new Proxy<Contract>({} as any, {
    get(target, prop, receiver) {
      if (Reflect.has(rey, prop)) {
        return Reflect.get(rey, prop, receiver);
      } else if (Reflect.has(registry, prop)) {
        return Reflect.get(registry, prop, receiver);
      } else {
        return undefined;
      }
    },
  });
}

export function DevelopmentContract(options?: TransactionOptions) {
  return SmartContract("http://localhost:8545", {
    registry: "0x556ED3bEaF6b3dDCb1562d3F30f79bF86fFC05B9",
    rey: "0x76C19376b275A5d77858c6F6d5322311eEb92cf5",
  }, options);
}

export function TestnetContract(provider: Provider, options?: TransactionOptions) {
  return SmartContract(provider, {
    registry: "0xC05f9be01592902e133F398998E783b6cbD93813",
    rey: "0xe410f8ff9ce89b2c2bd940967cac9dade139a0c7",
  }, options);
}
