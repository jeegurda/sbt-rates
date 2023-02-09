const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

const MinifyPlugin = require("babel-minify-webpack-plugin");

const entry = require('./webpack.entry')();

module.exports = env => merge(common(env), {
  entry,
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        'BABEL_ENV': JSON.stringify('production')
      }
    }),
    new MinifyPlugin()
  ],
  devtool: 'source-map'
});
