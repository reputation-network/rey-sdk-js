import RegistryContract from "./registry";
export default RegistryContract;

export function DevelopmentContract() {
  return new RegistryContract(
    "http://localhost:8545",
    "0x556ED3bEaF6b3dDCb1562d3F30f79bF86fFC05B9",
  );
}

export function TestnetContract(nodeUrl: string) {
  return new RegistryContract(
    nodeUrl,
    "0xC05f9be01592902e133F398998E783b6cbD93813",
  );
}
