import { dummySignature } from "../utils";
import { SignStrategy } from "../types";

export default function dummySignStrategyFactory(): SignStrategy {
  return () => Promise.resolve(dummySignature());
}
