import axios, { AxiosInstance } from "axios";
import { Buffer } from "safe-buffer";
import { ManifestEntry } from "../contracts/registry";
import { dummySignature, hash, isAddress, validateStructSignature } from "../utils";
import { AppManifest } from "./types";

/**
 * Returns a url-friendly base64 string of the provided data
 * @param data
 */
function encodeBase64Url(data: any) {
  return Buffer.from(JSON.stringify(data))
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function decodeBase64Url(data: any) {
  return Buffer.from(data, "base64").toString("utf8");
}

/**
 * Returns an unsigned JWT with the provided payload.
 * @param payload
 */
function encodeUnsignedJwt(payload: any): string {
  const headers = { typ: "JWT", alg: "none" };
  const parts = [headers, payload, ""];
  return parts.map((p) => p ? encodeBase64Url(p) : "").join(".");
}

/**
 * Returns the parsed payload section of the provided JWT
 * @param jwt
 */
function decodeUnsignedJwt<T= any>(jwt: string): T {
  const [headers, payload, signature] = jwt.split(".");
  return JSON.parse(decodeBase64Url(payload));
}

/**
 * Encodes the given value into a header-safe string
 * @param value
 */
function encodeHeaderValue(value: any) {
  const json = JSON.stringify(value);
  const b64 = encodeBase64Url(json);
  return b64;
}

/**
 * Extracts the given header from the header hash, parses its value as a
 * base64(json()) encoded value and returs the parsed result.
 * @param headers
 * @param headerName
 * @throws {Error} if no header is found with the given name
 * @throws {Error} if no header value can not be base64 decoded
 * @throws {Error} if no header value can not be json decoded
 */
function decodeHeader(headers: Record<string, string>, headerName: string): any {
  const headerEntry = Object.entries(headers).find(
    ([h]) => h.toLowerCase() === headerName.toLocaleLowerCase());
  if (!headerEntry) {
    throw new Error(`Missing app response header: ${headerName}`);
  }
  const [, base64JsonEncodedHeader] = headerEntry;
  const jsonEncodedHeader = (() => {
    try {
      return decodeBase64Url(base64JsonEncodedHeader);
    } catch (e) {
      throw new Error(`Could not base64-decode app response header: ${headerName}`);
    }
  })();
  const headerValue = (() => {
    try {
      return JSON.parse(jsonEncodedHeader);
    } catch (e) {
      throw new Error(`Could not json-decode app response header: ${headerName}`);
    }
  })();
  return headerValue;
}

/**
 * Given any structure (target), executes the provided visitor for every leaf value
 * and assigns the return value as the new value for the entry.
 * A leaf value is anything that is NOT an array nor an object.
 * @param target
 * @param visitor
 */
function traverseLeafs(target: any, visitor: (v: any, k: string) => any, path: string[] = []): any {
  if (Array.isArray(target)) {
    return target.map((e, i) => traverseLeafs(e, visitor, path.concat([i.toString()])));
  } else if (target && typeof target === "object") {
    return Object.keys(target).reduce((r, key) => {
      const value = target[key];
      return Object.assign({}, r, {
        [key]: traverseLeafs(value, visitor, path.concat([key])),
      });
    }, {});
  } else {
    return visitor(target, path.join("."));
  }
}

/**
 * Retrieves the manifest from the provided url, and returns its
 * {@link ManifestEntry} alongside the manifest itself.
 *
 * The manifest entry is NOT VALIDATED, this is responsablilty of
 * the caller of the function.
 */
async function getManifestWithEntry(
  url: string,
  http: AxiosInstance = axios.create(),
): Promise<ManifestEntry & { manifest: AppManifest }> {
  const res = await http.get(url, { responseType: "arraybuffer" });
  const dataBuffer = Buffer.from(res.data);
  const manifest = (() => {
    try {
      return JSON.parse(dataBuffer.toString("utf8"));
    } catch (e) {
      throw new Error(`Could not parse app manifest at url ${url}`);
    }
  })();
  return {
    url,
    manifest,
    hash: hash(dataBuffer as any),
  };
}

export {
  decodeBase64Url,
  decodeUnsignedJwt,
  decodeHeader,
  dummySignature,
  encodeHeaderValue,
  encodeBase64Url,
  encodeUnsignedJwt,
  getManifestWithEntry,
  isAddress,
  traverseLeafs,
  validateStructSignature,
};
