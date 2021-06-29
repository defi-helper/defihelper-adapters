const glob = require("glob");
const path = require("path");

module.exports = {
  mode: "development",
  entry: glob.sync(path.resolve(__dirname, "./projects/**/index.js")).reduce(
    (entry, file) => ({
      ...entry,
      [path.parse(path.parse(file).dir).name]: file,
    }),
    {}
  ),
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "[name].js",
    libraryTarget: "commonjs2",
  },
};
