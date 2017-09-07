const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: {
        libs: ['babel-polyfill'],
        rates: './src/js/rates-app.js'
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.resolve(__dirname, 'dist/assets/'),
        // publicPath: '/',
        sourceMapFilename: './maps/[file].map'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: 'libs',
            minChunks: Infinity
        }),
        new CleanWebpackPlugin(['./dist/assets'])
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
                loader: 'babel-loader'
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
    }
};
