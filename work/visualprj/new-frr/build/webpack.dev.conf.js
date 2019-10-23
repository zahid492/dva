'use strict';
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const merge = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');

const HOST = process.env.HOST;
const PORT = process.env.PORT && Number(process.env.PORT);
const autoprefixer = require('autoprefixer');

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    optimization: {
        namedChunks: true,
        namedModules: true,
        noEmitOnErrors: true,
        occurrenceOrder: true,
        splitChunks: {
            minSize: 30000,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            name: true,
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                },
                commons: {
                    name: "commons",
                    chunks: "initial",
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0,
                    // enforce: true,
                },
                // default: {
                //     priority: -20,
                //     reuseExistingChunk: true,
                // },
                vendors: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    chunks: "all"
                },
            }

        }
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            hmr: false,
                        },
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            minimize: true,
                            sourceMap: false,
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {

                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9',
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        },
                    },
                ],

            },
            {
                test: /(\.scss)$/,
                use: [

                    {
                        loader: 'style-loader',
                        options: {
                            hmr: false,
                        },
                    },
                    {
                        loader: 'css-loader', // translates CSS into CommonJS
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: 'postcss-loader', // postprocesses CSS
                        options: {
                            sourceMap: true,
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9',
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        }
                    },
                    {
                        loader: 'resolve-url-loader'
                    },
                    {
                        loader: 'sass-loader', // compiles Sass to CSS
                        options: {
                            includePaths: ['src', 'node_modules/compass-mixins/lib'],
                            sourceMap: true
                        }
                    },
                ],

            },
        ],
    },
    // cheap-module-eval-source-map is faster for development
    devtool: config.dev.devtool,

    // these devServer options should be customized in /config/index.js
    devServer: {
        clientLogLevel: 'warning',
        historyApiFallback: {
            rewrites: [
                {from: /^\/$/, to: path.posix.join(config.dev.assetsPublicPath, 'src/template/login.html')},
                {from: /^\/first/, to: path.posix.join(config.dev.assetsPublicPath, 'src/template/first.html')},
                {from: /^\/second/, to: path.posix.join(config.dev.assetsPublicPath, 'src/template/second.html')},
                {from: /^\/third/, to: path.posix.join(config.dev.assetsPublicPath, 'src/template/third.html')},
                {from: /^\/fourth/, to: path.posix.join(config.dev.assetsPublicPath, 'src/template/fourth.html')},
                {from: /^\/fifth/, to: path.posix.join(config.dev.assetsPublicPath, 'src/template/fifth.html')},
            ],
        },
        hot: true,
        contentBase: path.join(__dirname, "../"), // since we use CopyWebpackPlugin.
        compress: true,
        host: HOST || config.dev.host,
        port: PORT || config.dev.port,
        open: config.dev.autoOpenBrowser,
        overlay: config.dev.errorOverlay
            ? {warnings: false, errors: true}
            : false,
        publicPath: config.dev.assetsPublicPath,
        proxy: config.dev.proxyTable,
        quiet: true, // necessary for FriendlyErrorsPlugin
        watchOptions: {
            poll: config.dev.poll,
        }
    },
    plugins: [
        // Makes some environment variables available to the JS code, for example:
        // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
        // It is absolutely essential that NODE_ENV was set to production here.
        // Otherwise React will be compiled in the very slow development mode.

        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin(),

        new HtmlWebpackPlugin({
            filename: 'login.html',
            template: 'src/template/login.html',
            inject: 'body',
            chunks: ["commons", "vendors", "login"],
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),

        new HtmlWebpackPlugin({
            filename: 'first.html',
            template: 'src/template/first.html',
            inject: 'body',
            chunks: ["commons", "vendors", "first"],
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),

        new HtmlWebpackPlugin({
            filename: 'second.html',
            template: 'src/template/second.html',
            inject: 'body',
            chunks: ["commons", "vendors", "second"],
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),

        new HtmlWebpackPlugin({
            filename: 'third.html',
            template: 'src/template/third.html',
            inject: 'body',
            chunks: ["commons", "vendors", "three"],
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),

        new HtmlWebpackPlugin({
            filename: 'fourth.html',
            template: 'src/template/fourth.html',
            inject: 'body',
            chunks: ["commons", "vendors", "four"],
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),

        new HtmlWebpackPlugin({
            filename: 'fifth.html',
            template: 'src/template/fifth.html',
            inject: 'body',
            chunks: ["commons", "vendors", "fifth"],
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),

        new HtmlWebpackPlugin({
            filename: 'one.html',
            template: 'src/template/one.html',
            inject: 'body',
            chunks: ["commons", "vendors", "one"],
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeAttributeQuotes: true
            },
            chunksSortMode: 'dependency'
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, '../static'),
                to: config.dev.assetsSubDirectory,
                ignore: ['.*']
            }
        ]),

    ]
});

module.exports = new Promise((resolve, reject) => {
    portfinder.basePort = process.env.PORT || config.dev.port;
    portfinder.getPort((err, port) => {
        if (err) {
            reject(err)
        } else {
            // publish the new Port, necessary for e2e tests
            process.env.PORT = port;
            // add port to devServer config
            devWebpackConfig.devServer.port = port;

            // Add FriendlyErrorsPlugin
            devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
                compilationSuccessInfo: {
                    messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
                },
                onErrors: config.dev.notifyOnErrors
                    ? utils.createNotifierCallback()
                    : undefined
            }));

            resolve(devWebpackConfig)
        }
    })
});
