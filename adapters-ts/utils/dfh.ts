import { axios, env } from "../lib";
import { Alias } from "./coingecko";

export function getPriceFeeds(
  network: string | number,
  addresses: string[] = []
) {
  const query = addresses.map((address) => `token=${address}`).join("&");
  return axios
    .get<Record<string, Alias>>(
      `${env.DFH_HOST}/token/price-feed/${network}?${query}`
    )
    .then(({ data }) => data);
}
