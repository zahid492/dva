'use strict';
const path = require('path');
const config = require('../config');
const utils = require('./utils');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

module.exports = {
    entry: {
        "index": ['./src/index']
    },
    output: {
        pathinfo: true,
        path: config.build.assetsRoot,
        filename: '[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    externals: {
        'simplemde': 'SimpleMDE'
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            include: [resolve('src')],
            exclude: [/node_modules/],
            // options: {
            //     presets: ['env'],
            //     plugins: ['transform-runtime']
            // }
        }, {
            test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('img/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('media/[name].[hash:7].[ext]')
            }
        }, {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            options: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
            }
        }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias:
            {
                'simplemde$':
                    'simplemde/dist/simplemde.min.js',
                'highlight.js$':
                    'highlight.js/lib/highlight.js',
                '@': resolve('src'),
                'api': resolve('src/api')
            }
    }
};
