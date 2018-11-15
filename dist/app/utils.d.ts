import { AxiosInstance } from "axios";
import { ManifestEntry } from "../contracts/registry";
import { reyHash as hash } from "../utils";
import { dummySignature } from "../utils/signature";
import { validateSignature } from "../utils/struct-validations";
import { AppManifest } from "./types";
/**
 * Returns a url-friendly base64 string of the provided data
 * @param data
 */
declare function encodeBase64Url(data: any): string;
declare function decodeBase64Url(data: any): string;
/**
 * Returns an unsigned JWT with the provided payload.
 * @param payload
 */
declare function encodeUnsignedJwt(payload: any): string;
/**
 * Returns the parsed payload section of the provided JWT
 * @param jwt
 */
declare function decodeUnsignedJwt<T = any>(jwt: string): T;
/**
 * Extracts the given header from the header hash, parses its value as a
 * base64(json()) encoded value and returs the parsed result.
 * @param headers
 * @param headerName
 * @throws {Error} if no header is found with the given name
 * @throws {Error} if no header value can not be base64 decoded
 * @throws {Error} if no header value can not be json decoded
 */
declare function decodeHeader(headers: Record<string, string>, headerName: string): any;
/**
 * Given any structure (target), executes the provided iterator for every leaf value
 * and assigns the return value as the new value for the entry.
 * A leaf value is anything that is NOT an array nor an object.
 * @param target
 * @param iterator
 */
declare function traverseLeafs(target: any, iterator: (v: any) => any): any;
/**
 * Retrieves the manifest from the provided url, and returns its
 * {@link ManifestEntry} alongside the manifest itself.
 *
 * The manifest entry is NOT VALIDATED, this is responsablilty of
 * the caller of the function.
 */
declare function getManifestWithEntry(url: string, http?: AxiosInstance): Promise<ManifestEntry & {
    manifest: AppManifest;
}>;
export { decodeBase64Url, decodeUnsignedJwt, decodeHeader, dummySignature, encodeBase64Url, encodeUnsignedJwt, getManifestWithEntry, hash, traverseLeafs, validateSignature, };
