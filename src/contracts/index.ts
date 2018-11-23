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
