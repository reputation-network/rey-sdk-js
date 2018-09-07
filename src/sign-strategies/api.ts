import fetch from "isomorphic-fetch";
import sha3 from "web3-utils/src/soliditySha3";
import { SignStrategy } from "../types";
import { deepFlatten } from "../utils";

/**
 * Returns a new SignStrategy that delegates the signature process into
 * a backend REST API call.
 *
 * The request that will reach the API is a POST with a JSON containing
 * the hash to be signed.
 * The response from the endpoint MUST be a JSON object containing the
 * signature of the hash.
 *
 * @throws {TypeError} if opts.endpoint is not a string
 */
export default function apiSignHashFactory(o: IOpts): SignStrategy {
  if (!o.endpoint || typeof o.endpoint !== "string") {
    throw new TypeError("opts.endpoint must be provided");
  }
  const opts: Required<IOpts> = Object.assign({
    transformRequest: (request: any) => request,
    transformResponseBody: (data: any) => data.signature,
  }, o);
  return async (...data: any[]) => {
    const hash = sha3(...deepFlatten(data));
    const res = await fetch(opts.endpoint, opts.transformRequest({
      method: "POST",
      headers: { "content-type": "application/json; charset=utf-8" },
      body: JSON.stringify({ hash }),
    }));
    const body = await res.json()
    if (!res.ok) {
      const error = body.error || body.message || body;
      throw new Error(`api sign error: ${res.statusText} ${error}`);
    }
    return opts.transformResponseBody(body);
  }
}

interface IOpts {
  /**
   * The endpoint that the sign request will be targeted to
   */
  endpoint: string;
  /**
   * Transform the fetch request params before sending it.
   * It recieves the default fetch init object and MUST return
   * the same object with the necessary changes.
   */
  transformRequest?: (init: any) => any;
  /**
   * Adaptor for the response body after performing the API fetch.
   * It recieves the body from the response of the API call and MUST
   * return a signature.
   */
  transformResponseBody?: (data: any) => string;
}
