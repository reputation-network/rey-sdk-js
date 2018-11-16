import { TransactionOptions } from "web3-eth-contract";
import * as Address from "./constants";
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
      return Reflect.has(target, prop) && Reflect.get(target, prop, receiver)
        || Reflect.has(rey, prop) && Reflect.get(rey, prop, receiver)
        || Reflect.has(registry, prop) && Reflect.get(registry, prop, receiver)
        || undefined;
    },
    has(target, prop) {
      return Reflect.has(target, prop)
        || Reflect.has(rey, prop)
        || Reflect.has(registry, prop);
    },
    getOwnPropertyDescriptor(target, prop) {
      return Reflect.getOwnPropertyDescriptor(target, prop)
        || Reflect.getOwnPropertyDescriptor(rey, prop)
        || Reflect.getOwnPropertyDescriptor(Object.getPrototypeOf(rey), prop)
        || Reflect.getOwnPropertyDescriptor(registry, prop)
        || Reflect.getOwnPropertyDescriptor(Object.getPrototypeOf(registry), prop)
        || undefined;
    },
  });
}

export function DevelopmentContract(options?: TransactionOptions) {
  return SmartContract("http://localhost:8545", {
    registry: Address.DEVELOPMENT_REGISTRY_CONTRACT_ADDRESS,
    rey: Address.DEVELOPMENT_REY_CONTRACT_ADDRESS,
  }, options);
}

export function TestnetContract(provider: Provider, options?: TransactionOptions) {
  return SmartContract(provider, {
    registry: Address.RINKEBY_REGISTRY_CONTRACT_ADDRESS,
    rey: Address.RINKEBY_REY_CONTRACT_ADDRESS,
  }, options);
}
