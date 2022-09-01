import * as base from "../../base";
import abi from "./abi/factory.json";

export { abi };

export const contract = base.contract(abi);

export const multicallContract = base.multicallContract(abi);
