import { SignStrategy } from "../types";
/**
 * Uses the given provider to personally sign data. If no account address provider
 * is passed, it will use the first account available. If no password provider is
 * passed, password defaults to an empty string.
 * @param provider
 * @param account
 * @param password
 */
export default function EthPersonalSignStrategy(provider: Provider, account?: AsyncProvider, password?: AsyncProvider<[string]>): SignStrategy;
declare type Provider = string | any;
declare type AsyncProvider<T extends A[] = [], A = any> = string | Promise<string> | ((...args: T) => string) | ((...args: T) => Promise<string>);
export {};
