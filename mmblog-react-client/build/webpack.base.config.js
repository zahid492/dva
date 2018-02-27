'use strict';
const path = require('path');
const config = require('../config');
const utils = require('./utils');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const extractTextPluginOptions = {};

module.exports = {
  entry: {
    index: ["./src/index"]
  },
  output: {
    pathinfo: true,
    path: config.build.assetsRoot,
    filename: "[name].js",
    chunkFilename: "static/js/[name].chunk.js",
    publicPath:
      process.env.NODE_ENV === "production"
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath
  },
  externals: {
    simplemde: "SimpleMDE"
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: "babel-loader",
        include: [resolve("src")],
        exclude: [/node_modules/]
        // options: {
        //     babelrc: false,
        //     presets: ['env', require.resolve('babel-preset-react-app')],
        //     plugins: ['transform-runtime', ["import", { "libraryName": "antd", "style": "css" }] ],
        //     compact: true,
        //     cacheDirectory: true,
        // }
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: require.resolve("style-loader"),
              use: [
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true
                  }
                },
                {
                  loader: require.resolve("postcss-loader"),
                  options: {
                    ident: "postcss", // https://webpack.js.org/guides/migrating/#complex-options
                    plugins: () => [
                      require("postcss-flexbugs-fixes"),
                      autoprefixer({
                        browsers: [
                          ">1%",
                          "last 2 versions",
                          "Firefox ESR",
                          "not ie < 9" // React doesn't support IE8 anyway
                        ],
                        flexbox: "no-2009"
                      })
                    ]
                  }
                },
                require.resolve("less-loader")
              ]
            },
            extractTextPluginOptions
          )
        )
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      },
      {
        test: /\.(scss|sass)$/,
        loader: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: require.resolve("style-loader"),
              use: [
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true
                  }
                },
                {
                  loader: require.resolve("postcss-loader"),
                  options: {
                    ident: "postcss", // https://webpack.js.org/guides/migrating/#complex-options
                    plugins: () => [
                      require("postcss-flexbugs-fixes"),
                      autoprefixer({
                        browsers: [
                          ">1%",
                          "last 2 versions",
                          "Firefox ESR",
                          "not ie < 9" // React doesn't support IE8 anyway
                        ],
                        flexbox: "no-2009"
                      })
                    ]
                  }
                },
                require.resolve("sass-loader")
              ]
            },
            extractTextPluginOptions
          )
        )
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      },
      // The notation here is somewhat confusing.
      // "postcss" loader applies autoprefixer to our CSS.
      // "css" loader resolves paths in CSS and adds assets as dependencies.
      // "style" loader normally turns CSS into JS modules injecting <style>,
      // but unlike in development configuration, we do something different.
      // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
      // (second argument), then grabs the result CSS and puts it into a
      // separate file in our build process. This way we actually ship
      // a single CSS file in production instead of JS code injecting <style>
      // tags. If you use code splitting, however, any async bundles will still
      // use the "style" loader inside the async code so CSS from them won't be
      // in the main CSS file.
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          Object.assign(
            {
              fallback: require.resolve("style-loader"),
              use: [
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    importLoaders: 1,
                    minimize: true,
                    sourceMap: true
                  }
                },
                {
                  loader: require.resolve("postcss-loader"),
                  options: {
                    // Necessary for external CSS imports to work
                    // https://github.com/facebookincubator/create-react-app/issues/2677
                    ident: "postcss",
                    plugins: () => [
                      require("postcss-flexbugs-fixes"),
                      autoprefixer({
                        browsers: [
                          ">1%",
                          "last 4 versions",
                          "Firefox ESR",
                          "not ie < 9" // React doesn't support IE8 anyway
                        ],
                        flexbox: "no-2009"
                      })
                    ]
                  }
                }
              ]
            },
            extractTextPluginOptions
          )
        )
        // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
      },
      {
        test: /\.scss$/,
        // exclude: /^node_modules$/,
        loader: ["style-loader", "css-loader", "sass-loader"]
      },
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx|mjs)$/,
          /\.css$/,
          /\.less$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/
        ],
        loader: require.resolve("file-loader"),
        options: {
          name: utils.assetsPath("media/[name].[hash:8].[ext]")
        }
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("img/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("media/[name].[hash:7].[ext]")
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: "url-loader",
        options: {
          limit: 10000,
          name: utils.assetsPath("fonts/[name].[hash:7].[ext]")
        }
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".json", ".less", ".scss", ".css"],
    alias: {
      simplemde$: "simplemde/dist/simplemde.min.js",
      "highlight.js$": "highlight.js/lib/highlight.js",
      "@": resolve("src"),
      api: resolve("src/api")
    }
  },
  plugins: [
    // 配置提取出的样式文件
    new ExtractTextPlugin({
      filename: utils.assetsPath("css/[name].[contenthash:8].css"),
      allChunks: true
    })
  ]
};
