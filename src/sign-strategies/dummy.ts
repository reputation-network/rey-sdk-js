import { SignStrategy } from "../types";
import { dummySignature } from "../utils";

export default function dummySignStrategyFactory(): SignStrategy {
  return () => Promise.resolve(dummySignature());
}
