'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

const ManifestPlugin = require('webpack-manifest-plugin');
// const ProgressBarPlugin = require('progress-bar-webpack-plugin');


//添加热重载
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    baseWebpackConfig.entry[name] = ['webpack-hot-middleware/client?reload=true'].concat(baseWebpackConfig.entry[name])
});

module.exports = merge(baseWebpackConfig, {
    // cheap-module-eval-source-map is faster for development
    devtool: 'source-map',
    module: {
        rules: utils.styleLoaders({sourceMap: config.dev.cssSourceMap})
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': config.dev.env
        }),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'body',
        }),
        // 开启全局的模块热替换(HMR)
        new webpack.NamedModulesPlugin((chunk) => {
            if (chunk.name) {
                return chunk.name;
            }
            return chunk.mapModules(m => path.relative(m.context, m.request)).join("_");
        }),
        new webpack.HotModuleReplacementPlugin(),
        // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息,
        // new ManifestPlugin(),
        // new ProgressBarPlugin(),

        // new webpack.NoEmitOnErrorsPlugin(),
        new FriendlyErrorsPlugin()
    ]
});

