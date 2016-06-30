var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
var config = require('./config').config;

module.exports = {
    entry: {
        bundle: [
            './client'
        ],
        vendor: [
            'react', 'react-dom'
        ]
    },
    resolve: {
        modulesDirectories: [
            path.resolve('./shared'),
            'node_modules'
        ],
        extensions: ['', '.js', '.jsx'],
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].js',
        publicPath: '/'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
        }, {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract("style", "css!sass")
        }, {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract("style", "css")
        }, {
            test: /\.gif$/,
            loader: "url-loader",
            query: {
                limit: 10000,
                mimetype: "image/gif"
            }
        }, {
            test: /\.jpg$/,
            loader: "url-loader",
            query: {
                limit: 10000,
                mimetype: "image/jpg"
            }
        }, {
            test: /\.png$/,
            loader: "url-loader",
            query: {
                limit: 10000,
                mimetype: "image/png"
            }
        }, {
            test: /\.svg/,
            loader: "url-loader",
            query: {
                limit: 26000,
                mimetype: "image/svg+xml"
            }
        }, {
            test: /\.(woff|woff2|ttf|eot)/,
            loader: "url-loader",
            query: {
                limit: 100000
            }
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                BROWSER: JSON.stringify(true),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
                HOST: JSON.stringify(config.host),
                PORT: JSON.stringify(config.port),
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
            filename: 'vendor.bundle.js'
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            }
        }),
        new ExtractTextPlugin('style.css', {
            allChunks: true
        })
    ]
};
