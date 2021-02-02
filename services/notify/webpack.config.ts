const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /.html?$/,
        loader: "file-loader",
        exclude: /node_modules/,
        options: {
          name: "public/[name].[ext]",
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
};
