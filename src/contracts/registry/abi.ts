// FIXME: We should store the abi as a JSON, but that breaks the library in
// runtime since JSON files are not carried over to the output dir
export default [{"constant": false,"inputs": [{"name": "_entry","type": "string"}],"name": "setEntry","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "_address","type": "address"}],"name": "getEntry","outputs": [{"name": "","type": "string"}],"payable": false,"stateMutability": "view","type": "function"}]
