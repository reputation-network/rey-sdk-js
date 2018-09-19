import AppClient from "./client";
import { buildAppParams, buildAppParamsWithHash } from "./helpers";

export default class App extends AppClient {
  public static buildAppParams = buildAppParams;
  public static buildAppParamsWithHash = buildAppParamsWithHash;
}
