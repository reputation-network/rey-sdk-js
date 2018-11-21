import { AxiosResponse } from "axios";
import { Buffer } from "safe-buffer";
import { Proof, Signature } from "../structs";
import { KnownSignatureFormat } from "../types";
import EncryptionKey from "./encryption-key";
import { decodeHeader } from "./utils";

export default class AppResponse<T extends Record<string, any>> {
  public static fromAxiosRespone<T>(res: AxiosResponse<string>) {
    const rawData = Buffer.from(res.data);
    return new AppResponse<T>({
      rawData: Buffer.from(res.data),
      data: JSON.parse(rawData.toString()),
      signature: decodeHeader(res.headers, "x-app-signature"),
      proof: decodeHeader(res.headers, "x-app-proof"),
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
    rawData: any,
    data: T,
    signature: KnownSignatureFormat,
    proof: Proof,
  }) {
    this.rawData = Buffer.from(opts.rawData);
    this.data = opts.data;
    this.signature = new Signature(opts.signature);
    this.proof = new Proof(opts.proof);
  }

  public toABI() {
    return [
      this.rawData,
      this.signature,
    ];
  }
}
