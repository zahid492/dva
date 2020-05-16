// 服务端渲染
const path = require("path");
const nodeExternals = require('webpack-node-externals');
const LoadablePlugin = require('@loadable/webpack-plugin')
const DIST_PATH = path.resolve(__dirname, '../dist')
const production = process.env.NODE_ENV === 'production'
const development =
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

const target = "node";
const server = {
    name: target,
    mode: development ? 'development' : 'production',

    entry: path.resolve(__dirname, `../src/main_${target}.js`),
    //
    target: target,
    output: {
        publicPath: path.join(DIST_PATH, target),
        path: path.join(DIST_PATH, target),
        filename: development ? "[name].js" : "[name].[chunkhash:8].js",
        chunkFilename: development ? "[name].chunk.js" : "[name].[chunkhash:8].js",
        sourceMapFilename: development ? "[name].map" : "[name].[chunkhash:8].map",
        libraryTarget: "commonjs2"
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: [/node_modules/],
                use: {
                    loader: "babel-loader",
                    options: {
                        caller: {target}
                    }
                }
            },
            // TODO 样式问题
            {
                test: /\.scss$/,
                use: ['ignore-loader']
            }
        ],
    },
    plugins: [
        new LoadablePlugin({
            // filename: "loadable-stats.json",
            // writeToDisk: true
        }),

    ],

    externals: ['@loadable/component', nodeExternals()],
    devtool: "source-map"
};

module.exports = server
