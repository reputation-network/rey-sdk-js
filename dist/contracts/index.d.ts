import { TransactionOptions } from "web3-eth-contract";
import RegistryContract from "./registry";
import ReyContract from "./rey";
declare type Provider = string | any;
declare type ContractAddress = string | {
    registry: string;
    rey: string;
};
export declare type Contract = RegistryContract & ReyContract;
export default function SmartContract(provider: Provider, address: ContractAddress, options?: TransactionOptions): Contract;
export declare function DevelopmentContract(options?: TransactionOptions): Contract;
export declare function TestnetContract(provider: Provider, options?: TransactionOptions): Contract;
export {};
