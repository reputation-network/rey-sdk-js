import RegistryContract from "./registry";
export default RegistryContract;
export declare function DevelopmentContract(): RegistryContract;
export declare function TestnetContract(nodeUrl: string): RegistryContract;
