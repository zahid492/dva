'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const rxPaths = require('rxjs/_esm5/path-mapping');

const PORT = process.env.PORT;

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        login: './src/login.js',
        first: './src/first.js',
        second: './src/second.js',
        three: './src/three.js',
        four: './src/four.js',
        fifth: './src/fifth.js',
        one: './src/one.js',
    },
    output: {
        path: config.build.assetsRoot,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath,
        devtoolModuleFilenameTemplate: function (info) {
            return "file:///" + info.absoluteResourcePath;
        },
        libraryTarget: "umd"
    },

    resolve: {
        extensions: ['.js', '.jsx', '.ejs', '.json', '.sass', '.scss'],
        alias: Object.assign({
            '@': resolve('src'),
        }, rxPaths())
    },
    externals: {
        jquery: 'jQuery',
        "lodash": {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
        }

    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: "underscore-template-loader",
                query: {
                    // engine: 'lodash',
                    parseMacros: true,
                    prependFilenameComment: __dirname,
                }
            },
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('node_modules/webpack-dev-server/client')],

            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('media/[name].[hash:7].[ext]')
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            },
            {
                loader: 'file-loader',
                exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.scss$/, /\.hbs/],
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
        ]
    },

    node: {
        // prevent webpack from injecting useless setImmediate polyfill because Vue
        // source contains it (although only uses it if it's native).
        setImmediate: false,
        // prevent webpack from injecting mocks to Node native modules
        // that does not make sense for the client
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
};
