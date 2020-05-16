const path = require("path");
const {smartStrategy} = require("webpack-merge");
const baseConfig = require("./webpack.base.config");

const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");

const smp = new SpeedMeasurePlugin();

// production
// todo 文档根据入口文件，打包css到独立文件，路由时候
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');

const plugins = [

    new MiniCssExtractPlugin({
        filename: `css/[name].[hash:8].css`,
        chunkFilename: `css/[name].[hash:8].css`,
        ignoreOrder: true
    }),

];

const cfg = smartStrategy({
    plugins: "prepend",
    output: "replace"
})(baseConfig, {
    mode: "production",

    devtool: "cheap-module-source-map",
    output: {
        path: path.resolve(__dirname, "../dist/web"),
        filename: "[name].[chunkhash:8].js",
        chunkFilename: "[name].[chunkhash:8].js",
        sourceMapFilename: "[name].[chunkhash:8].map",
        // 配和 externals
        // libraryTarget: "umd",
        // 当作为 库 导出时候的名称
        // library: "extB"
    },
    module: {
        rules: [],
    },

    plugins: plugins,

    optimization: {
        minimize: true,
        minimizer: [
            // 压缩 js
            new TerserPlugin({
                cache: true,
                parallel: 4,
                test: /\.js(\?.*)?$/i,
                include: [path.resolve(__dirname, "../src")],
                exclude: /node_modeles/,
            }),
            // 压缩 css
            new OptimizeCssAssetsPlugin({
                // cssProcessor: cssnano,
                cssProcessorOptions: {
                    discardComments: {
                        removeAll: true
                    }
                }
            })
        ],
    },
})

module.exports = cfg;
