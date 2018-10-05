"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// FIXME: We should store the abi as a JSON, but that breaks the library in
// runtime since JSON files are not carried over to the output dir
// tslint:disable-next-line
exports.default = [{ "constant": false, "inputs": [{ "name": "_value", "type": "string" }, { "name": "_hash", "type": "bytes32" }], "name": "setEntry", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_address", "type": "address" }], "name": "getEntry", "outputs": [{ "name": "", "type": "string" }, { "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }];
//# sourceMappingURL=abi.js.map