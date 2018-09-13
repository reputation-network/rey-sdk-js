import AppClient from "./client";
import { buildAppParams, buildAppParamsWithHash } from "./helpers";

export default class App extends AppClient {
  static buildAppParams = buildAppParams;
  static buildAppParamsWithHash = buildAppParamsWithHash;
}
