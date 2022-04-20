import * as pairV2 from "./v2/pair";
import * as routerV2 from "./v2/router";
import * as constantsV3 from "./v3/constants";
import * as poolV3 from "./v3/pool";
import * as factoryV3 from "./v3/factory";
import * as quoterV3 from "./v3/quoter";

export namespace V2 {
  export const pair = pairV2;
  export const router = routerV2;
}

export namespace V3 {
  export const constants = constantsV3;
  export const pool = poolV3;
  export const factory = factoryV3;
  export const quoter = quoterV3;
}
