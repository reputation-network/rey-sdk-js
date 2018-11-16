import { expect } from "chai";
import * as http from "http";
import sinon from "sinon";
import AppClient, { buildOptions } from "../../src/app/client";
import { reyHash } from "../../src/utils";

describe("AppClient", () => {
  describe("#manifestEntry", () => {
    it("returns the manifest entry from the contract", async () => {
      const expectedManifestEntry = {
        url: "http://app1.reputation.network/manifest",
        hash: `0x${"1".repeat(64)}`,
      };
      const address = `0x${"1".repeat(40)}`;
      const opts = buildOptions({});
      const contractSpy = sinon.stub(opts.contract, "getEntry")
        .withArgs(address).resolves(expectedManifestEntry);
      const app = new AppClient(address, opts);
      const actualManifestEntry = await app.manifestEntry();
      expect(actualManifestEntry).to.deep.equal(expectedManifestEntry);
      expect(contractSpy.calledOnce).to.equal(true);
    });
    it("throws if contract returns no manifest entry", async () => {
      const address = `0x${"1".repeat(40)}`;
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
        hash: `0x${"1".repeat(64)}`,
      };
      const address = `0x${"1".repeat(40)}`;
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
        hash: `0x${"1".repeat(64)}`,
      };
      const address = `0x${"1".repeat(40)}`;
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
      const address = `0x${"1".repeat(40)}`;
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
      const address = `0x${"1".repeat(40)}`;
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
        expect.fail("Did not throw");
      } catch (e) {
        expect(e.message).to.match(/manifest hash/i);
      } finally {
        await new Promise((resolve) => server.close(resolve));
      }
    });
    it("returns the manifest from cache if available", async () => {
      const address = `0x${"1".repeat(40)}`;
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
      const address = `0x${"1".repeat(40)}`;
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
    const addr = (letter: string) => `0x${letter.repeat(40)}`;
    // const manifestCache = new Map<string, any>([
    //   [ addr("a"), {address: addr("a"), app_dependencies: [addr("b")]}],
    //   [ addr("b"), {address: addr("b"), app_dependencies: [addr("c"), addr("d")]}],
    //   [ addr("d"), {address: addr("d"), app_dependencies: []}],
    // ]);
    it("returns an empty array if app has no dependencies", async () => {
      const address = addr("a");
      const manifestCache = new Map<string, any>([
        [address, { address, app_dependencies: [] }],
      ]);
      const opts = buildOptions({ manifestCache });
      const app = new AppClient(address, opts);
      const expectedExtraReadPermissions = [];
      const actualExtraReadPermissions = await app.extraReadPermissions();
      expect(actualExtraReadPermissions).to.equal(expectedExtraReadPermissions);
    });
    it("returns an array with direct dependencies", async () => {
      const address = addr("a");
      const manifestCache = new Map<string, any>([
        [ address, {address, app_dependencies: [addr("b")]}],
        [ addr("b"), {address: addr("b"), app_dependencies: []}],
      ]);
      const opts = buildOptions({ manifestCache });
      const app = new AppClient(address, opts);
      const expectedExtraReadPermissions = [];
      const actualExtraReadPermissions = await app.extraReadPermissions();
      expect(actualExtraReadPermissions).to.equal(expectedExtraReadPermissions);
    });
  });
});
