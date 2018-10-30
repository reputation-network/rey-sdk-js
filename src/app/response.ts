import { AxiosResponse } from "axios";
import { Buffer } from "safe-buffer";
import { Proof, Signature } from "../structs";
import EncryptionKey from "./encryption-key";
import { decodeHeader, hash, validateSignature } from "./utils";

export class AppResponse<T extends Record<string, any>> {
  public static fromAxiosRespone<T>(res: AxiosResponse<string>) {
    const rawData = Buffer.from(res.data);
    return new AppResponse<T>({
      rawData: Buffer.from(res.data),
      data: JSON.parse(rawData.toString()),
      signature: new Signature(decodeHeader(res.headers, "x-app-signature")),
      proof: new Proof(decodeHeader(res.headers, "x-app-proof")),
    });
  }

  public static async fromEncryptedAppResponse<T, R>(
    res: AppResponse<R>,
    encryptionKey: EncryptionKey,
  ) {
    const decryptedData = await encryptionKey.decrypt(res.data);
    return new AppResponse<T>({...res, data: decryptedData});
  }

  public readonly data: Record<string, any>;
  public readonly rawData: Buffer;
  public readonly signature: Signature;
  public readonly proof: Proof;

  constructor(opts: {
    rawData: Buffer,
    data: T,
    signature: Signature,
    proof: Proof,
  }) {
    this.rawData = opts.rawData;
    this.data = opts.data;
    this.signature = opts.signature;
    this.proof = opts.proof;
  }

  public async validateSignature(source: string) {
    validateSignature(hash([this.rawData]), this.signature, source);
  }
}
