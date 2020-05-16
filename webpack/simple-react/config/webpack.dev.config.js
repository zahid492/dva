const path = require("path");
const {smartStrategy} = require("webpack-merge");
const baseConfig = require("./webpack.base.config");

const NamedModulesPlugin = require('webpack/lib/NamedModulesPlugin');
const HotModuleReplacementPlugin = require('webpack/lib/HotModuleReplacementPlugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// package.json scripts.** dev
const TARGET = process.env.npm_lifecycle_event;

const plugins = [
    new FriendlyErrorsPlugin(),
    // 开发时候热替换输入日子，显示模块名称
    new NamedModulesPlugin(),

    // 该插件的作用就是实现模块热替换，实际上当启动时带上 `--hot` 参数，
    // 会注入该插件，生成 .hot-update.json 文件。
    new HotModuleReplacementPlugin(),
];

module.exports = smartStrategy({
    entry: 'prepend',
    plugins: "prepend"
})(baseConfig, {
    mode: "development",
    // devtool: "cheap-module-eval-source-map",
    devtool: "source-map",
    // devtool: "source-map",
    entry: {
        main: [
            // 这里一定要与 devServer.port 一致
            'webpack-dev-server/client?http://localhost:3000/',
            'webpack/hot/dev-server',
        ],

    },

    module: {
        rules: [],
    },
    optimization: {
        splitChunks: {
            chunks: "all",
            cacheGroups: {
                dev: {
                    name: "dev",
                    minChunks: 1,
                    test: /\/node_modules\//,
                    priority: 1,
                }
            }
        },
    },
    plugins: plugins,

    devServer: {
        // 开启热替换
        hot: true,
        contentBase: path.resolve(__dirname, '../dist/web'),
        publicPath: '/',
        host: "localhost",
        port: 3000,
        // https: true,
        disableHostCheck: true,
        // webpack-dev-middleware options
        stats: {
            // remove build modules information.
            modules: false,
            // remove build modules information to chunk information.
            chunkModules: false,
            colors: true
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
        },
        historyApiFallback: {
            rewrites: [
                {from: /^\/$/, to: "/index.html"}
            ]
        }
    },

    watch: true,
    // 优化监听
    watchOptions: {
        // 自动刷新，不监听目录
        ignored: /node_modules/,
        poll: 3000,
        aggregateTimeout: 800
    }
});
