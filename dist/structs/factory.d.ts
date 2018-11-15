import { SignedEntity, SignStrategy } from "../types";
import Proof from "./proof";
import ReadPermission from "./read-permission";
import Request from "./request";
import Session from "./session";
import Transaction from "./transaction";
import WritePermission from "./write-permission";
interface SignStrategyByActor {
    default?: SignStrategy;
    subject?: SignStrategy;
    source?: SignStrategy;
    reader?: SignStrategy;
    verifier?: SignStrategy;
    writer?: SignStrategy;
}
interface Constructor<T> {
    new (...args: any[]): T;
}
export declare type SignStrategyForFactory = SignStrategy | SignStrategyByActor;
export declare function build<T extends SignedEntity>(clazz: Constructor<T>, payload: any, sign: SignStrategy): Promise<T>;
export declare function buildSignStrategyByActor(o: SignStrategyForFactory): Required<SignStrategyByActor>;
export declare function buildReadPermission(readPermission: any, signStrategy: SignStrategyForFactory): Promise<ReadPermission>;
export declare function buildSession(session: any, signStrategy: SignStrategyForFactory): Promise<Session>;
export declare function buildWritePermission(writePermission: any, signStrategy: SignStrategyForFactory): Promise<WritePermission>;
export declare function buildRequest(req: any, signStrategy: SignStrategyForFactory): Promise<Request>;
export declare function buildProof(proof: any, signStrategy: SignStrategyForFactory): Promise<Proof>;
export declare function buildTransaction(transaction: any, signStrategy: SignStrategyForFactory): Promise<Transaction>;
declare const _default: {
    build: typeof build;
    buildReadPermission: typeof buildReadPermission;
    buildSession: typeof buildSession;
    buildWritePermission: typeof buildWritePermission;
    buildRequest: typeof buildRequest;
    buildProof: typeof buildProof;
    buildTransaction: typeof buildTransaction;
};
export default _default;
