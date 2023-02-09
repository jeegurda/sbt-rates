const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const webpack = require('webpack');

const entry = require('./webpack.entry')(true);

module.exports = env => merge(common(env), {
  entry,
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development'),
        'BABEL_ENV': JSON.stringify('development')
      }
    })
  ],
  devtool: 'cheap-module-source-map',
  // watch: true,
  devServer: {
    // contentBase: './dist/rates/',
    hot: true,
    /*proxy: {
      '/api/*': 'http://localhost:3000'
    },*/
    stats: {
      modules: false,
      moduleTrace: false,
      assetsSort: 'name'
    }
  },
});
