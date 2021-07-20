const path = require("path");
const glob = require("glob");

module.exports = {
  mode: "development",
  entry: glob.sync(path.resolve(__dirname, "./adapters/*/index.js")).reduce(
    (entry, file) => ({
      ...entry,
      [path.parse(path.parse(file).dir).name]: file,
    }),
    {}
  ),
  output: {
    path: path.resolve(__dirname, "./adapters-public"),
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
};
