const { axios, env } = require('../lib');

async function read(protocol, key) {
  return axios
    .get(`${env.CACHE_HOST}?protocol=${protocol}&key=${key}`)
    .then(({ data }) => data)
    .catch((e) => {
      if (e.response) {
        throw new Error(`Read cache failed: ${e.response.status} ${e.response.data}`);
      }
      throw new Error(`Read cache failed: ${e.message}`);
    });
}

async function write(auth, protocol, key, data) {
  return axios
    .post(`${env.CACHE_HOST}?protocol=${protocol}&key=${key}`, data, {
      headers: { Auth: auth },
    })
    .catch((e) => {
      if (e.response) {
        throw new Error(`Write cache failed: ${e.response.status} ${e.response.data}`);
      }
      throw new Error(`Write cache failed: ${e.message}`);
    });
}

module.exports = {
  read,
  write,
};
