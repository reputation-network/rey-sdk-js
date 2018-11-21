import { expect } from "chai";
import * as http from "http";
import sinon from "sinon";
import AppClient, { buildOptions } from "../../src/app/client";
import { buildAppParams } from "../../src/app/factory";
import AppParams from "../../src/app/params";
import AppResponse from "../../src/app/response";
import { decodeUnsignedJwt, dummySignature } from "../../src/app/utils";
import { hash as reyHash } from "../../src/utils";

describe("AppClient", () => {
  const addr = (l: string|number) => `0x${String(l).repeat(40)}`;
  const hash = (l: string|number) => `0x${String(l).repeat(64)}`;
  const manf = (l: string|number) => hash(l);
  afterEach(() => sinon.restore());

  describe("#manifestEntry", () => {
    it("returns the manifest entry from the contract", async () => {
      const expectedManifestEntry = {
        url: "http://app1.reputation.network/manifest",
        hash: hash(1),
      };
      const address = addr(1);
      const opts = buildOptions({});
      const contractSpy = sinon.stub(opts.contract, "getEntry")
        .withArgs(address).resolves(expectedManifestEntry);
      const app = new AppClient(address, opts);
      const actualManifestEntry = await app.manifestEntry();
      expect(actualManifestEntry).to.deep.equal(expectedManifestEntry);
      expect(contractSpy.calledOnce).to.equal(true);
    });
    it("throws if contract returns no manifest entry", async () => {
      const address = addr(2);
      const opts = buildOptions({});
      sinon.stub(opts.contract, "getEntry")
        .withArgs(address).resolves(null);
      const app = new AppClient(address, opts);
      try {
        await app.manifestEntry();
        expect.fail("Did not throw");
      } catch (e) {
        expect(e.message).to.match(/manifest entry/);
      }
    });
    it("returns the manifest entry if is available on the cache", async () => {
      const expectedManifestEntry = {
        url: "http://app1.reputation.network/manifest",
        hash: hash(3),
      };
      const address = addr(3);
      const opts = buildOptions({});
      sinon.stub(opts.manifestEntryCache, "has")
        .withArgs(address).returns(true);
      const cacheGetSpy = sinon.stub(opts.manifestEntryCache, "get")
        .withArgs(address).returns(expectedManifestEntry);
      const app = new AppClient(address, opts);
      const actualManifestEntry = await app.manifestEntry();
      expect(actualManifestEntry).to.deep.equal(expectedManifestEntry);
      expect(cacheGetSpy.calledOnce).to.equal(true);

    });
    it("caches the manifest entry after a sucessful contract call", async () => {
      const manifestEntry = {
        url: "http://app1.reputation.network/manifest",
        hash: hash(4),
      };
      const address = addr(4);
      const opts = buildOptions({});
      sinon.stub(opts.contract, "getEntry")
        .withArgs(address).resolves(manifestEntry);
      const app = new AppClient(address, opts);
      const cacheSetSpy = sinon.spy(opts.manifestEntryCache, "set");
      await app.manifestEntry();
      const expectedArgs = [address, manifestEntry];
      const actualArgs = cacheSetSpy.getCall(0).args;
      expect(actualArgs).to.deep.equal(expectedArgs);
    });
  });
  describe("#manifest", () => {
    it("fetches the manifestEntry.url using opts.http", async () => {
      const address = addr(1);
      const opts = buildOptions({});
      const app = new AppClient(address, opts);
      const expectedManifest = { address, app_name: "Test App"};
      const manifestJson = JSON.stringify(expectedManifest);
      const manifestHash = reyHash([Buffer.from(manifestJson)]);
      const server = http.createServer((req, res) => {
        res.write(manifestJson);
        res.end();
      });
      await new Promise((resolve) => server.listen(1024, () => resolve()));
      const manifestEntry = {
        url: "http://127.0.0.1:1024",
        hash: manifestHash,
      };
      sinon.stub(app, "manifestEntry")
        .withArgs(address).resolves(manifestEntry);
      const actualManifest = await app.manifest();
      expect(actualManifest).to.deep.equal(expectedManifest);
      await new Promise((resolve) => server.close(resolve));
    });
    it("throws if manifestEntry.url fetch fails");
    it("throws if manifestEntry.hash check fails (fetch and blockchain disagreement)", async () => {
      const address = addr(2);
      const opts = buildOptions({});
      const app = new AppClient(address, opts);
      const expectedManifest = { address, app_name: "Test App" };
      const manifestJson = JSON.stringify(expectedManifest);
      const server = http.createServer((req, res) => {
        res.write(manifestJson);
        res.end();
      });
      await new Promise((resolve) => server.listen(1024, () => resolve()));
      const manifestEntry = {
        url: "http://127.0.0.1:1024",
        hash: `0x${"1".repeat(64)}`,
      };
      sinon.stub(app, "manifestEntry")
        .withArgs(address).resolves(manifestEntry);
      try {
        await app.manifest();
        expect.fail(null, null, "Did not throw");
      } catch (e) {
        expect(e.message).to.match(/manifest hash/i);
      } finally {
        await new Promise((resolve) => server.close(resolve));
      }
    });
    it("returns the manifest from cache if available", async () => {
      const address = addr(3);
      const expectedManifest = { address, app_name: "Test App" };
      const opts = buildOptions({});
      const app = new AppClient(address, opts);
      sinon.stub(opts.manifestCache, "has")
        .withArgs(address).returns(true);
      const cacheGetSpy = sinon.stub(opts.manifestCache, "get")
        .withArgs(address).returns(expectedManifest);
      const actualManifest = await app.manifest();
      expect(actualManifest).to.deep.equal(expectedManifest);
      expect(cacheGetSpy.calledOnce).to.equal(true);
    });
    it("caches the manifest after a sucessful fetch", async () => {
      const address = addr(4);
      const opts = buildOptions({});
      const app = new AppClient(address, opts);
      const manifest = { address, app_name: "Test App" };
      const manifestJson = JSON.stringify(manifest);
      const manifestHash = reyHash([Buffer.from(manifestJson)]);
      const server = http.createServer((req, res) => {
        res.write(manifestJson);
        res.end();
      });
      const cacheSetSpy = sinon.spy(opts.manifestCache, "set");
      await new Promise((resolve) => server.listen(1024, () => resolve()));
      const manifestEntry = {
        url: "http://127.0.0.1:1024",
        hash: manifestHash,
      };
      sinon.stub(app, "manifestEntry")
        .withArgs(address).resolves(manifestEntry);
      await app.manifest();
      await new Promise((resolve) => server.close(resolve));
      const expectedArgs = [address, manifest];
      const actualArgs = cacheSetSpy.getCall(0).args;
      expect(actualArgs).to.deep.equal(expectedArgs);
    });
  });
  describe("#extraReadPermissions", () => {
    it("returns an empty array if app has no dependencies", async () => {
      const address = addr("a");
      const manifestCache = new Map<string, any>([
        [address, { address, app_dependencies: [] }],
      ]);
      const opts = buildOptions({ manifestCache });
      const app = new AppClient(address, opts);
      const expectedExtraReadPermissions: any[] = [];
      const actualExtraReadPermissions = await app.extraReadPermissions();
      expect(actualExtraReadPermissions).to.deep.equal(expectedExtraReadPermissions);
    });
    it("returns an array with direct dependencies", async () => {
      const address = addr("a");
      const manifestEntryCache = new Map<string, any>([
        [address, {hash: manf("a"), url: "http://127.0.0.1/manifest-a.json"}],
        [addr("b"), {hash: manf("b"), url: "http://127.0.0.1/manifest-b.json"}],
      ]);
      const manifestCache = new Map<string, any>([
        [address, {address, app_dependencies: [addr("b")]}],
        [addr("b"), {address: addr("b"), manifest: manf("b"), app_dependencies: []}],
      ]);
      const opts = buildOptions({ manifestCache, manifestEntryCache });
      const app = new AppClient(address, opts);
      const expectedExtraReadPermissions: any[] = [
        {reader: address, source: addr("b"), manifest: manf("b")},
      ];
      const actualExtraReadPermissions = await app.extraReadPermissions();
      expect(actualExtraReadPermissions).to.deep.equal(expectedExtraReadPermissions);
    });
    it("returns an array with inherited dependencies from direct dependencies", async () => {
      const address = addr("a");
      const manifestEntryCache = new Map<string, any>([
        [address, { hash: manf("a"), url: "http://127.0.0.1/manifest-a.json" }],
        [addr("b"), { hash: manf("b"), url: "http://127.0.0.1/manifest-b.json" }],
        [addr("c"), { hash: manf("c"), url: "http://127.0.0.1/manifest-c.json" }],
        [addr("d"), { hash: manf("d"), url: "http://127.0.0.1/manifest-d.json" }],
        [addr("e"), { hash: manf("e"), url: "http://127.0.0.1/manifest-e.json" }],
      ]);
      const manifestCache = new Map<string, any>([
        [address, { address, app_dependencies: [addr("b")] }],
        [addr("b"), { address: addr("b"), manifest: manf("b"), app_dependencies: [addr("c"), addr("e")] }],
        [addr("c"), { address: addr("c"), manifest: manf("c"), app_dependencies: [addr("d")] }],
        [addr("d"), { address: addr("d"), manifest: manf("d"), app_dependencies: [] }],
        [addr("e"), { address: addr("e"), manifest: manf("e"), app_dependencies: [] }],
      ]);
      const opts = buildOptions({ manifestCache, manifestEntryCache });
      const app = new AppClient(address, opts);
      const expectedExtraReadPermissions: any[] = [
        { reader: address, source: addr("b"), manifest: manf("b") },
        { reader: addr("b"), source: addr("c"), manifest: manf("c") },
        { reader: addr("b"), source: addr("e"), manifest: manf("e") },
        { reader: addr("c"), source: addr("d"), manifest: manf("d") },
      ];
      const actualExtraReadPermissions = await app.extraReadPermissions();
      expect(actualExtraReadPermissions).to.deep.equal(expectedExtraReadPermissions);
    });
  });
  describe("#query", () => {
    const serverHandler = sinon.stub();
    const server = http.createServer(serverHandler);
    const serverUrl = "http://127.0.0.1:1024";
    let appParams: AppParams;

    before("build appParams", async () => {
      appParams = await buildAppParams({
        request: {
          readPermission: {
            reader: addr("a"),
            source: addr("b"),
            subject: addr("c"),
            manifest: hash("f"),
            expiration: Math.floor(Date.now() / 1000),
          },
          session: {
            subject: addr("c"),
            verifier: addr("d"),
            fee: 100,
            nonce: Date.now(),
          },
          counter: 1,
          value: 100,
        },
      }, () => Promise.resolve(dummySignature()));
    });

    before("start server", () => {
      serverHandler.reset();
      serverHandler.callsFake((req, res) => res.end());
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

    it("thorws error if verifier manifest does not have a verifier_url", async () => {
      const source = appParams.request.readPermission.source;
      const verifier = appParams.request.session.verifier;
      const manifestCache = new Map<string, any>([[verifier, {}]]);
      const opts = buildOptions({ manifestCache });
      const app = new AppClient(source, opts);
      try {
        await app.query(appParams);
        expect.fail("Did not throw");
      } catch (e) {
        expect(e.message).to.match(/verifier_url/);
      }
    });
    it("fetches the verifier with the provided params", async () => {
      const manifestCache = new Map<string, any>([
        [appParams.request.session.verifier, { verifier_url: serverUrl }],
      ]);
      serverHandler.callsFake((req: http.IncomingMessage, res: http.ServerResponse) => {
        res.write(JSON.stringify({ data: "qwerty" }));
        res.end();
      });
      const appRes = sinon.createStubInstance(AppResponse);
      sinon.stub(AppResponse, "fromAxiosRespone").resolves({});
      sinon.stub(AppResponse, "fromEncryptedAppResponse").resolves(appRes);
      // appRes.validateSignature.resolves({});

      const opts = buildOptions({ manifestCache });
      const app = new AppClient(addr("a"), opts);
      await app.query(appParams);

      const [, appParamsToken] = serverHandler.getCall(0).args[0].headers.authorization.split(" ");
      const auth = decodeUnsignedJwt(appParamsToken);
      expect(JSON.parse(JSON.stringify(appParams))).to.deep.equal(auth);
    });
    it("throws if the signature of the response is not valid", async () => {
      const manifestCache = new Map<string, any>([
        [appParams.request.session.verifier, { verifier_url: serverUrl }],
      ]);
      serverHandler.callsFake((req: http.IncomingMessage, res: http.ServerResponse) => {
        res.write(JSON.stringify({ data: "qwerty" }));
        res.end();
      });
      const appRes = sinon.createStubInstance(AppResponse);
      sinon.stub(AppResponse, "fromAxiosRespone").resolves({});
      sinon.stub(AppResponse, "fromEncryptedAppResponse").resolves(appRes);
      // appRes.validateSignature.rejects(new Error("Test Validation Error"));

      const opts = buildOptions({ manifestCache });
      const app = new AppClient(addr("a"), opts);

      try {
        await app.query(appParams);
        expect.fail(null, null, "Did not throw");
      } catch (e) {
        expect(e.message).to.match(/test validation error/i);
      }
    });

    it("returns the decrypted response from the verifier", async () => {
      const manifestCache = new Map<string, any>([
        [appParams.request.session.verifier, { verifier_url: serverUrl }],
      ]);
      serverHandler.callsFake((req: http.IncomingMessage, res: http.ServerResponse) => {
        res.write(JSON.stringify({ data: "qwerty" }));
        res.end();
      });
      const appRes = sinon.createStubInstance(AppResponse);
      sinon.stub(AppResponse, "fromAxiosRespone").resolves({});
      sinon.stub(AppResponse, "fromEncryptedAppResponse").resolves(appRes);
      // appRes.validateSignature.resolves({});

      const opts = buildOptions({ manifestCache });
      const app = new AppClient(addr("a"), opts);
      const expectedAppRes = appRes;
      const actualAppRes = await app.query(appParams);
      expect(actualAppRes).to.equal(expectedAppRes);
    });
  });
});
