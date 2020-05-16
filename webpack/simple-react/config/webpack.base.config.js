const path = require('path');
const os = require('os');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
// 模块合并，作用域提升
// const ModuleConcatenationPlugin = require("webpack/lib/optimize/ModuleConcatenationPlugin");
// const AddAssetHtmlPlugin = require("add-asset-html-webpack-plugin");
// webpack 5 会废弃
const AutoDllPlugin = require('autodll-webpack-plugin');
const HappyPack = require('happypack');
// const CompressionWebpackPlugin = require('compression-webpack-plugin')
// 服务端渲染资源文件
// const LoadablePlugin = require('@loadable/webpack-plugin');

let happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length,
});

const cdn = {
    css: ['https://cdn.bootcdn.net/ajax/libs/normalize/8.0.1/normalize.css'],
    js: [
        'https://cdn.bootcdn.net/ajax/libs/moment.js/2.25.3/moment.min.js',
        'https://cdn.bootcdn.net/ajax/libs/moment.js/2.25.3/locale/zh-cn.js',
        // "https://cdn.bootcdn.net/ajax/libs/react/16.13.1/umd/react.development.js",
        // "https://cdn.bootcdn.net/ajax/libs/react-dom/16.13.1/umd/react-dom.development.js"
    ],
};

const plugins = [
    // new webpack.DefinePlugin({
    //     'process.env.NODE_ENV': JSON.stringify(devMode ? 'development' : 'production'),
    //     'perfixerURL': JSON.stringify('//yzadmin.111.com.cn')
    // }),

    // 路径大小写敏感
    new CaseSensitivePathsPlugin(),
    // 注入编译好的 dll 到 html-webpack-plugin
    // new AddAssetHtmlPlugin([
    //     {
    //         // 要添加到编译中的文件的绝对路径，以及生成的HTML文件。支持globby字符串
    //         filepath: require.resolve(path.resolve(__dirname, '../dist/dll/libs.dll.js')),
    //         // 文件输出目录
    //         outputPath: "dll",
    //         // 脚本或链接标记的公共路径
    //         publicPath: 'dll'
    //     }
    // ]),
    new AutoDllPlugin({
        inject: true, // will inject the DLL bundles to index.html
        filename: '[name].[hash:8].js',
        debug: true,
        path: '../dist/dll',
        entry: {
            react: ['react', 'react-dom'],
            // antd:  ['antd/es']
        },
    }),
    new HtmlWebpackPlugin({
        template: 'public/index.html',
        filename: 'index.html',
        inject: true,
        // 多入口时，挑选该入口的 chunk
        // chunks: ['index', 'vendor'],
        // 给生成的 js 加 ?hash 值
        hash: true,
        // 配合 externals 从外部引入常用库
        cdn: cdn,
        minify: {
            // 移除注释
            removeComments: true,
            // 压缩空格
            // collapseWhitespace: true
        },
    }),
    // 去除 moment.js 里的无用语言
    // new webpack.ContextReplacementPlugin(
    //     /moment[\\/]dist[\\/]locale$/,
    //     /zh-cn|en-us/
    // ),
    // 开启 Scope Hoisting 会慢些
    // new ModuleConcatenationPlugin(),

    new HappyPack({
        id: 'js',
        loaders: [
            {
                loader: 'babel-loader',
                options: {
                    // babel api.caller 传参数，默认 babel-loader
                    caller: { target: 'web' },
                    cacheDirectory: true,
                },
            },
        ],
        // 默认 3
        // threads: 6,
        // 共享线程池模式， 以防止资源占用过多
        threadPool: happyThreadPool,
    }),

    new HappyPack({
        id: 'scss',
        loaders: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader',
        ],
        // 共享线程池模式， 以防止资源占用过多
        threadPool: happyThreadPool,
    }),

    // ssr 时候用
    // new LoadablePlugin({
    //     // filename: "loadable-stats.json",
    //     // writeToDisk: true
    // }),
    new webpack.DllReferencePlugin({
        // name dll 暴露地方的名称，默认 manifest.name 参考 externals
        // content 请求到模块id 的映射，manifest.content
        // scope dll 内容的前缀
        // dll 如何暴露 libraryTarget
        context: process.cwd(),
        manifest: require('../dist/dll/libs-manifest.json'),
    }),

    // 可视化块大小分布
    new BundleAnalyzerPlugin(),

    // 清除 dist 输出目录，有 dll 不清楚，暂时手动
    new CleanWebpackPlugin({
        // 输出日志
        // verbose: true,
        // true 模拟删除
        dry: false,
    }),
    // new CompressionWebpackPlugin({
    //     filename: '[path].gz[query]',
    //     algorithm: 'gzip',
    //     test: new RegExp(
    //         '\\.(' +
    //         config.build.productionGzipExtensions.join('|') +
    //         ')$'
    //     ),
    //     threshold: 10240,
    //     minRatio: 0.8
    // })
];

module.exports = {
    cache: true,
    stats: {
        // 检查所有模块
        // maxModules: Infinity,
        // 显示降级原因
        // optimizationBailout: true
    },
    entry: {
        main: [path.resolve(__dirname, '../src/main.js')],
        // 把和 main 重复引用的模块单独打包，配合 splitChunks，或 dllPlugin
        // libs: ['react', 'react-dom']
    },

    output: {
        path: path.resolve(__dirname, '../dist/web'),
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        sourceMapFilename: '[name].map',
        // 配和 externals
        // libraryTarget: "umd",
        // 当作为 库 导出时候的名称
        // library: "extB"
    },

    module: {
        rules: [
            // {
            //     test: /\.ts$/,
            //     loader: "ts-loader"
            // },
            {
                test: /\.js$/,
                include: [path.join(__dirname, '../src')],
                exclude: [/node_modules/],
                use: {
                    loader: 'eslint-loader',
                },
                enforce: 'pre',
            },
            {
                // 如果只有 .js 就不要 .jsx?，提升正则性能
                test: /\.js$/,
                use: ['happypack/loader?id=js'],
                exclude: [/node_modules/],
            },
            {
                test: /\.s?css$/,
                use: ['happypack/loader?id=scss'],
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[path][name]-[hash:5].[ext]',
                            limit: 1024,
                        },
                    },
                ],
            },
        ],
    },

    optimization: {
        // module ids 使用什么算法，hashed
        moduleIds: 'named',
        // 读取 module ids，默认开发启用，帮助调试
        // namedModules:true,
        // namedChunks: true,
        // natural 默认, named 调试，设置 namedChunks 影响此值
        // chunkIds: "named",
        splitChunks: {
            automaticNameDelimiter: '.',
            chunks: 'all',
            cacheGroups: {
                // 重复引用两次的
                // default: false,
                // 来自 node_modules 的
                // vendors: {
                //     name: "vendors",
                //     test: /\/node_modules\//,
                //     priority: 10,
                //     //  ignore splitChunks.minSize, splitChunks.minChunks, splitChunks.maxAsyncRequests
                //     //  and splitChunks.maxInitialRequests
                //     // enforce: true,
                // },
                // react ...，指定提取的公共chunk
                // base: {
                //     name: "base",
                //     minChunks: 2,
                //     priority: 10
                //
                // },
                common: {
                    test: /[\\/]src[\\/]/,
                    name: 'common',
                    chunks: 'all',
                    priority: 2,
                    minChunks: 2,
                },
                // 分离css到一个css文件
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    priority: 9,
                    enforce: true,
                },
            },
        },

        runtimeChunk: {
            name: entrypoint => `manifest.${entrypoint.name}`,
        },
    },
    plugins: plugins,

    resolve: {
        // 直接绝对路径告诉第三方模块位置，减少搜索
        modules: [
            path.resolve(__dirname, '../src'),
            path.resolve(__dirname, '../node_modules'),
        ],
        // 删browser，只用 main。 优先采用 es6模块，方便 tree shaking
        mainFields: ['jsnext:main', 'main'],
        extensions: ['.js', '.json', '.css', '.scss'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
        },
    },

    externals: {
        // 对象形式对应 libraryTarget: 'umd'
        // "react": 'React',
        // "react-dom": 'ReactDOM'
        moment: 'moment',
    },
};
