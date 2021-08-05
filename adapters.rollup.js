const { defineConfig } = require('rollup');
const json = require('@rollup/plugin-json');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
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
        },
        plugins: [json(), nodeResolve(), commonjs()],
      });
    });
});
