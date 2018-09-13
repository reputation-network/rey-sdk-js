"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = __importDefault(require("./client"));
const helpers_1 = require("./helpers");
class App extends client_1.default {
}
App.buildAppParams = helpers_1.buildAppParams;
App.buildAppParamsWithHash = helpers_1.buildAppParamsWithHash;
exports.default = App;
//# sourceMappingURL=index.js.map