import axios from "axios";
import { expect } from "chai";
import * as http from "http";
import sinon from "sinon";
import EncryptionKey from "../../src/app/encryption-key";
import AppResponse from "../../src/app/response";
import { dummySignature, encodeHeaderValue } from "../../src/app/utils";
import Proof from "../../src/structs/proof";

describe("AppResponse", () => {
  describe(".fromAxiosRespone", () => {
    const serverHandler = sinon.stub();
    const server = http.createServer(serverHandler);
    const serverUrl = "http://127.0.0.1:1024";
    before("start server", () => {
      return new Promise((resolve, reject) => {
        server.listen(1024, (err: Error) => {
          err ? reject(err) : resolve();
        });
      });
    });
    after("stop srever", () => {
      return new Promise((resolve, reject) => {
        server.close((err: Error) => {
          err ? reject(err) : resolve();
        });
      });
    });

    it("throws if response does not have X-App-Signature header", async () => {
      serverHandler.callsFake((req, res) => {
        res.write(JSON.stringify({ data: 123 }));
        res.end();
      });
      const axiosRes = await axios.get(serverUrl, { responseType: "arraybuffer" });
      expect(() => AppResponse.fromAxiosRespone(axiosRes))
        .to.throw(Error, "x-app-signature");
    });
    it("throws if response does not have X-App-Proof header", async () => {
      serverHandler.callsFake((req, res) => {
        res.setHeader("X-App-Signature", encodeHeaderValue(dummySignature()));
        res.write(JSON.stringify({ data: 123 }));
        res.end();
      });
      const axiosRes = await axios.get(serverUrl, { responseType: "arraybuffer" });
      expect(() => AppResponse.fromAxiosRespone(axiosRes))
        .to.throw(Error, "x-app-proof");
    });
    it("throws if response does not have X-App-Proof header", async () => {
      serverHandler.callsFake((req, res) => {
        res.setHeader("X-App-Signature", encodeHeaderValue(dummySignature()));
        res.write(JSON.stringify({ data: 123 }));
        res.end();
      });
      const axiosRes = await axios.get(serverUrl, { responseType: "arraybuffer" });
      expect(() => AppResponse.fromAxiosRespone(axiosRes))
        .to.throw(Error, "x-app-proof");
    });
    it("returns an AppResponse with the axios response values");
  });
  describe(".fromEncryptedAppResponse", () => {
    const encryptionKey = EncryptionKey.buildUnsigned();
    // const appResponse = new AppResponse({
    //   data: encryptionKey.encrypt({ data: 123 }),
    //   rawData: Buffer.from("abuffer"),
    //   signature: dummySignature(),
    //   proof: new Proof({}),
    // });
    it("resolves to an AppResponse with the original rawData, signature and proof");
    it("resolves to an AppResponse with decrypted data");
  });
  describe("#toABI", () => {
    it("returns its rawData and signature");
  });
});
