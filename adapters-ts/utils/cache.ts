import { axios, env } from "../lib";

export function read<T = any[]>(protocol: string, key: string) {
  return axios
    .get<T>(`${env.CACHE_HOST}/${protocol}/${key}.json`)
    .then(({ data }) => data)
    .catch((e) => {
      if (e.response) {
        throw new Error(
          `Read cache failed: ${e.response.status} ${e.response.data}`
        );
      }
      throw new Error(`Read cache failed: ${e.message}`);
    });
}

export function write(auth: string, protocol: string, key: string, data: any) {
  return axios
    .post(`${env.CACHE_HOST}/${protocol}/${key}.json`, data, {
      headers: { Auth: auth },
    })
    .catch((e) => {
        console.log(e.message)
      if (e.response) {
        throw new Error(
          `Write cache failed: ${e.response.status} ${e.response.data}`
        );
      }
      throw new Error(`Write cache failed: ${e.message}`);
    });
}
