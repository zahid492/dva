'use strict';
const {resolve, join} = require('path');
const config = require('../config');
const utils = require('./utils');
const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const nodeModulesPath = resolve(__dirname, '../../node_modules');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
let pathsToClean = [
    'public'
];
let cleanOptions = {
    root: __dirname,
    exclude: ['favicon.ico'],
    verbose: true,
    dry: false
};
const webpackConfig = merge(baseWebpackConfig, {
    module: {
        rules: utils.styleLoaders({sourceMap: config.build.productionSourceMap, extract: true})
    },
    output: {
        path: config.build.assetsRoot,
        filename: utils.assetsPath('[name].[chunkhash:8].js'),
        chunkFilename: utils.assetsPath('[id].[chunkhash:8].js')
    },
    plugins: [

        new CleanWebpackPlugin(pathsToClean, cleanOptions),
        new webpack.optimize.UglifyJsPlugin({
            // 最紧凑的输出
            beautify: false,
            // 删除所有的注释
            comments: false,
            compress: {
                // 在UglifyJs删除没有用到的代码时不输出警告
                warnings: false,
                // 删除所有的 `console` 语句
                // 还可以兼容ie浏览器
                drop_console: true,
                // 内嵌定义了但是只用到一次的变量
                collapse_vars: true,
                // 提取出出现多次但是没有定义成变量去引用的静态值
                reduce_vars: true,
            }
        }),
        // 配置提取出的样式文件
        new ExtractTextPlugin({
            filename: utils.assetsPath('css/[name].[contenthash:8].css'),
            allChunks: true
        }),

        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS from different components can be deduped.
        new OptimizeCSSPlugin({
            cssProcessorOptions: {
                safe: true
            }
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html',
            inject: 'true',
            minify: { // 压缩的方式
                removeComments: true,
                collapseWhitespace: true,
                removeAttributeQuotes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
            chunksSortMode: 'dependency'
        }),
        // new webpack.NamedModulesPlugin((chunk)=>{
        //   if(chunk.name){
        //     return chunk.name;
        //   }
        //   return chunk.mapModules(m=>path.relative(m.context, m.request)).join("_");
        // }),
        new webpack.HashedModuleIdsPlugin(),

        // 分别提取vendor、manifest
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function (module, count) {
                if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
                    return false;
                }
                return (
                    module.resource &&
                    /\.js$/.test(module.resource) &&
                    module.resource.indexOf(
                        nodeModulesPath
                    ) === 0
                )
            }
        }),

        // copy static
        new CopyWebpackPlugin([{
            from: resolve(__dirname, '../public'),
            to: config.build.assetsSubDirectory,
            ignore: ['.*']
        }]),


        new ProgressBarPlugin(),


    ]
});

if (config.build.productionGzip) {
    const CompressionWebpackPlugin = require('compression-webpack-plugin')

    webpackConfig.plugins.push(
        new CompressionWebpackPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp(
                '\\.(' +
                config.build.productionGzipExtensions.join('|') +
                ')$'
            ),
            threshold: 10240,
            minRatio: 0.8
        })
    )
}

module.exports = webpackConfig;
