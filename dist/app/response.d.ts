import { AxiosResponse } from "axios";
import { Buffer } from "safe-buffer";
import { Proof, Signature } from "../structs";
import EncryptionKey from "./encryption-key";
export declare class AppResponse<T extends Record<string, any>> {
    static fromAxiosRespone<T>(res: AxiosResponse<string>): AppResponse<T>;
    static fromEncryptedAppResponse<T, R>(res: AppResponse<R>, encryptionKey: EncryptionKey): Promise<AppResponse<T>>;
    readonly data: Record<string, any>;
    readonly rawData: Buffer;
    readonly signature: Signature;
    readonly proof: Proof;
    constructor(opts: {
        rawData: Buffer;
        data: T;
        signature: Signature;
        proof: Proof;
    });
    validateSignature(source: string): Promise<void>;
}
