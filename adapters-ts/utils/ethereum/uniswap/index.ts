import * as pairV2 from "./v2/pair";
import * as factoryV2 from "./v2/factory";
import * as routerV2 from "./v2/router";
import * as poolV3 from "./v3/pool";
import * as positionManagerV3 from "./v3/positionManager";
import * as swapRouterV3 from "./v3/swapRouter";

export namespace V2 {
  export const pair = pairV2;
  export const factory = factoryV2;
  export const router = routerV2;
}

export namespace V3 {
  export const pool = poolV3;
  export const positionManager = positionManagerV3;
  export const swapRouter = swapRouterV3;
}
