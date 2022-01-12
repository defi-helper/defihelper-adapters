require('dotenv').config();
const { defineConfig } = require('rollup');
const json = require('@rollup/plugin-json');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const replace = require('@rollup/plugin-replace');
const path = require('path');
const glob = require('tiny-glob');

export default glob(path.resolve(__dirname, './adapters/*/index.js')).then((files) => {
  return files
    .filter((adapter) => adapter !== 'adapters/utils/index.js')
    .map((adapter) => {
      return defineConfig({
        input: adapter,
        output: {
          file: `adapters-public/${path.parse(path.parse(adapter).dir).name}.js`,
          format: 'cjs',
          strict: false,
        },
        plugins: [
          replace({
            'process.env': JSON.stringify({
              CACHE_HOST: process.env.CACHE_HOST,
            }),
          }),
          json(),
          nodeResolve(),
          commonjs(),
        ],
      });
    });
});
