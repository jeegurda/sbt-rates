const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = env => {
  let eslintConfig = env && env['lint-config'] === 'dev' ? 'dev' : 'strict';
  let libs = [
    'babel-polyfill',
    'isomorphic-fetch',
    'lodash',
    'updeep',
    'moment',
    'redux',
    'react-redux',
    'redux-logger',
    'redux-thunk'
  ];

  return {
    entry: {
      libs,
      rates: './src/js/rates-app.js'
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[name].js',
      path: path.resolve(__dirname, 'dist/rates/'),
      // publicPath: '/',
      sourceMapFilename: './maps/[file].map'
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: 'libs',
        minChunks: Infinity
      }),
      new CleanWebpackPlugin(['./dist/rates']),
    ],
    module: {
      rules: [
        {
          test: /\.css/,
          use: [
            'style-loader',
            'css-loader'
          ]
        }, {
          test: /\.s[ca]ss$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        }, {
          test: /\.(gif|png|jpe?g|svg)$/,
          use: [
            'file-loader'
          ]
        }, {
          test: /\.jsx?$/,
          include: path.resolve(__dirname, 'src'),
          use: [
            'babel-loader'
          ]
        }, {
          test: /\.jsx?$/,
          exclude: /\/libs\//,
          use: {
            loader: 'eslint-loader',
            options: {
              formatter: require('eslint-formatter-pretty'),
              emitWarning: true,
              configFile: path.resolve(__dirname, `.eslintrc.${eslintConfig}.js`),
            }
          }
        }, {
          test: /\.html?$/,
          loader: 'html-loader',
          options: {
            interpolate: true
          }
        }
      ]
    },
    resolve: {
      extensions: ['*', '.json', '.jsx', '.js'],
      alias: {
        '@root': __dirname,
        '@js': path.resolve(__dirname, './src/js'),
        '@css': path.resolve(__dirname, './src/css')
      }
    },
    stats: {
      modules: false,
      moduleTrace: false,
      assetsSort: "name"
    }
  }
};
