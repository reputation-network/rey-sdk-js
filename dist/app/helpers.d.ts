import { SignStrategy } from "../types";
import { AppParams } from "../structs";
import { UnsignedAppParams, WithRequestHash } from "./types";
export declare function lazySignEntity<T>(entity: any, Entity: {
    new (t: Partial<T> | null): T;
}, signStrategy?: SignStrategy): Promise<T>;
export declare function buildAppParams(partialAppParams: UnsignedAppParams, opts: BuildAppParamsOpts): Promise<AppParams>;
export declare function buildAppParamsWithHash(partialAppParams: UnsignedAppParams, opts: BuildAppParamsOpts): Promise<UnsignedAppParams & WithRequestHash>;
interface BuildAppParamsOpts {
    subjectSignStrategy?: SignStrategy;
    readerSignStrategy?: SignStrategy;
}
export {};
