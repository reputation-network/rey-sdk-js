import { SignStrategy } from "../types";
/**
 * Returns a sign strategy that signs data with the provided privateKey
 * @param privateKey
 */
export default function privateKeySignStrategy(privateKey: string): SignStrategy;
