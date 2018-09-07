import { SignStrategy } from "../types";
import { AppParams } from "../structs";
interface BuildAppAccessTokenOpts {
    request: any;
    extraReadPermissions: Array<any>;
    subjectSignStrategy?: SignStrategy;
    readerSignStrategy?: SignStrategy;
}
/**
 * Returns a promise that resolves into a jwt containing the provided request
 * AFTER signing every readPermission plus session with the provided sign strategy
 * @param opts.request An object reperesentation of the request to sign
 * @param opts.signStrategy How should we sign things?
 */
export declare function buildToken(opts: BuildAppAccessTokenOpts): Promise<string>;
/**
 * Returns a promise that resolves into a jwt containing the provided request
 * AFTER signing every readPermission plus session with the provided sign strategy.
 *
 * The jwt payload WILL NOT BE a proper Request. Instead it will have a hash
 * claim instead of signature. Hash is the value to be signed and added to the payload
 * by the reader for it to be valid JWT.
 *
 * @param opts.request An object reperesentation of the request to sign
 * @param opts.signStrategy How should we sign things?
 */
export declare function buildTokenWithHash(opts: BuildAppAccessTokenOpts): Promise<string>;
/**
 * Returns a promise that resolves into an AppAccess AFTER signing readPermission,
 * session and extraReadPermissions have been signed with the provided sign strategy.
 *
 * @param opts.request An object reperesentation of the request to sign
 * @param opts.signStrategy How should we sign things?
 */
export declare function buildTokenPayload(o: BuildAppAccessTokenOpts): Promise<AppParams>;
export {};
