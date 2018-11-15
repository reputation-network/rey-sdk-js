import { SignStrategyForFactory } from "../structs/factory";
import AppClient from "./client";
import EncryptionKey from "./encryption-key";
import AppParams from "./params";
declare function buildEncryptionKey(encryptionKey: any, signStrategy: SignStrategyForFactory): Promise<EncryptionKey>;
declare function buildAppParams(appParams: any, signStrategy: SignStrategyForFactory): Promise<AppParams>;
declare function buildAppClient(address: string, opts: any): Promise<AppClient>;
export { buildEncryptionKey, buildAppParams, buildAppClient, };
