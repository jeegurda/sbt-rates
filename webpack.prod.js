const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

const MinifyPlugin = require("babel-minify-webpack-plugin");

module.exports = merge(common, {
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
