const { defineConfig } = require('rollup');
const json = require('@rollup/plugin-json');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const ts = require('rollup-plugin-ts');
const replace = require('@rollup/plugin-replace');
const commonjs = require('@rollup/plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const path = require('path');

export default defineConfig({
  input: path.resolve(__dirname, 'index.ts'),
  output: {
    file: path.resolve(__dirname, '../../adapters-public-ts', `${path.parse(__dirname).name}.js`),
    format: 'cjs',
    strict: false,
    sourcemap: false,
  },
  context: '{}',
  plugins: [
    nodeResolve({
      preferBuiltins: false,
    }),
    commonjs(),
    ts({
      tsconfig: path.resolve(__dirname, '../tsconfig.json'),
    }),
    replace({
      preventAssignment: true,
      'process.env': JSON.stringify({
        DFH_HOST: process.env.DFH_HOST,
        CACHE_HOST: process.env.CACHE_HOST,
        CACHE_AUTH: process.env.CACHE_AUTH,
      }),
    }),
    json(),
    terser(),
  ],
});
