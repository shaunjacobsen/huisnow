const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/app.ts',
  watch: true,
  target: 'node',
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'development',
  resolve: {
    extensions: ['.ts', '.js', '.tsx'],
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.js',
  },
};
