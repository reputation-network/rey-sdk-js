import { SignStrategy } from "../types";
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
export default function apiSignHashFactory(o: IOpts): SignStrategy;
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
export {};
