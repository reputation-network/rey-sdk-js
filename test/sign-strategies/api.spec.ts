import { expect } from "chai";
import http from "http";
import sinon from "sinon";
import createApiSignStrategy from "../../src/sign-strategies/api";
import { reyHash } from "../../src/utils";

describe("SignStrategy: API", () => {
  const serverHandler = sinon.stub();
  const server = http.createServer(serverHandler);
  const endpoint = "http://127.0.0.1:1024/api-sing-strategy";
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
  it("returns a function", () => {
    const signStrategy = createApiSignStrategy({ endpoint });
    expect(typeof signStrategy).to.equal("function");
  });
  it("throws if no endpoint is provided", () => {
    expect(() => createApiSignStrategy({ endpoint: "" })).to.throw(Error, /endpoint/);
  });
  it("calls the provided endpoint for every sign", async () => {
    serverHandler.callsFake((req, res) => {
      res.write("{}");
      res.end();
    });
    const ep = "http://127.0.0.1:1024/api-sing-strategy";
    const signStrategy = createApiSignStrategy({ endpoint: ep });
    await signStrategy("0xfacebeef");
    const [apiReq] = serverHandler.getCall(0).args;
    expect(serverHandler.calledOnce).to.equal(true);
    expect(apiReq.url).to.equal("/api-sing-strategy");
  });
  it("posts the hash of the provided data to be signed to the endpoint", async () => {
    const bodies: any[] = [];
    serverHandler.callsFake((req, res) => {
      const bodyData: any[] = [];
      req.on("data", (chunk: any) => bodyData.push(chunk)).on("end", () => {
        const body = JSON.parse(Buffer.concat(bodyData).toString());
        bodies.push(body);
        res.write("{}");
        res.end();
      });
    });
    const signStrategy = createApiSignStrategy({ endpoint });
    await signStrategy("0xfacebeef");
    await signStrategy("0xfacebeef", "0xdeadbeef");
    const [apiReq1, apiReq2] = bodies;
    expect(apiReq1).to.deep.equal({hash: reyHash(["0xfacebeef"])});
    expect(apiReq2).to.deep.equal({hash: reyHash(["0xfacebeef", "0xdeadbeef"])});
  });
  it("returns the signature field from the server response", async () => {
    const expectedSignature = `0x${"af".repeat(65)}`;
    serverHandler.callsFake((req, res) => {
      res.write(JSON.stringify({ signature: expectedSignature}));
      res.end();
    });
    const signStrategy = createApiSignStrategy({ endpoint });
    const actualSignature = await signStrategy("0xfacebeef");
    expect(actualSignature).to.equal(expectedSignature);
  });
  it("throws error if the endpoint returns a non 2XX status code", async () => {
    serverHandler.callsFake((req, res) => {
      res.statusCode = 400;
      res.end();
    });
    try {
      const signStrategy = createApiSignStrategy({ endpoint });
      await signStrategy("0xfacebeef");
    } catch (e) {
      expect(e.message).to.match(/request/i);
    }
  });
  it("allows to modify the request via transformRequest", async () => {
    let actualRequest = {};
    serverHandler.callsFake((req, res) => {
      const bodyData: any[] = [];
      req.on("data", (chunk: any) => bodyData.push(chunk)).on("end", () => {
        actualRequest = {
          method: req.method,
          url: req.url,
          headers: {
            "content-type": req.headers["content-type"],
            "x-custom-header": req.headers["x-custom-header"],
          },
          data: Buffer.concat(bodyData).toString(),
        };
        res.end();
      });
    });
    const expectedRequest = {
      method: "PUT",
      url: "/api-sing-strategy",
      headers: {
        "content-type": "text/plain",
        "x-custom-header": "custom header value",
      },
      data: "transformed data",
    };
    const transformRequest = () => ({ ...expectedRequest, url: endpoint });
    const signStrategy = createApiSignStrategy({ endpoint, transformRequest });
    await signStrategy("0xfacebeef");
    expect(actualRequest).to.deep.equal(expectedRequest);
  });
  it("allows to modify the response body via transformResponseBody", async () => {
    const expectedResponse = { signature: "0x1234" };
    serverHandler.callsFake((req, res) => {
      res.write(JSON.stringify(expectedResponse));
      res.end();
    });
    const transformResponseBody = (resBody: any) => resBody;
    const signStrategy = createApiSignStrategy({ endpoint, transformResponseBody });
    const actualResponse = await signStrategy("0xfacebeef");
    expect(actualResponse).to.deep.equal(expectedResponse);
  });
});
