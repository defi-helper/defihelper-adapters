require('dotenv').config();
const { defineConfig } = require('rollup');
const json = require('@rollup/plugin-json');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const ts = require('rollup-plugin-ts');
const replace = require('@rollup/plugin-replace');
const path = require('path');
const glob = require('tiny-glob');

export default glob(path.resolve(__dirname, './*/index.ts')).then((files) => {
  return files.map((adapter) => {
    return defineConfig({
      input: adapter,
      output: {
        file: path.resolve(__dirname, `../adapters-public-ts/${path.parse(path.parse(adapter).dir).name}.js`),
        format: 'cjs',
        strict: false,
      },
      plugins: [
        ts({
          tsconfig: path.resolve(__dirname, './tsconfig.json'),
        }),
        replace({
          'process.env': JSON.stringify({
            DFH_HOST: process.env.DFH_HOST,
            CACHE_HOST: process.env.CACHE_HOST,
            CACHE_AUTH: process.env.CACHE_AUTH,
          }),
        }),
        json(),
        nodeResolve(),
      ],
    });
  });
});
