import {
  build,
  buildReadPermission,
  buildRequest,
  buildSignStrategyByActor,
  SignStrategyForFactory,
} from "../structs/factory";
import AppClient from "./client";
import EncryptionKey from "./encryption-key";
import AppParams from "./params";

async function buildEncryptionKey(encryptionKey: any, signStrategy: SignStrategyForFactory) {
  const sign = buildSignStrategyByActor(signStrategy);
  encryptionKey = encryptionKey || EncryptionKey.buildUnsigned();
  return build(EncryptionKey, { ...encryptionKey }, sign.reader);
}

async function buildAppParams(appParams: any, signStrategy: SignStrategyForFactory) {
  const [request, extraReadPermissions, encryptionKey] = await Promise.all([
    buildRequest(appParams.request, signStrategy),
    Promise.all((appParams.extraReadPermissions || [])
      .map((rp: any) => buildReadPermission(rp, signStrategy))),
    buildEncryptionKey(appParams.encryptionKey, signStrategy),
  ]);
  return new AppParams({ request, extraReadPermissions, encryptionKey });
}

async function buildAppClient(address: string, opts: any) {
  return new AppClient(address, opts);
}

export {
  buildEncryptionKey,
  buildAppParams,
  buildAppClient,
};
