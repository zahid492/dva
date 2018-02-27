'use strict';
const path = require('path');
const utils = require('./utils');
const config = require('../config');

const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// OSX 路径精确匹配
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.config');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
// const ProgressBarPlugin = require('progress-bar-webpack-plugin');


//添加热重载
Object.keys(baseWebpackConfig.entry).forEach(function (name) {
    // Errors should be considered fatal in development, an overlay which displays when there is a runtime error.
    baseWebpackConfig.entry[name] = ['webpack-hot-middleware/client?reload=true',
        // require.resolve('react-error-overlay')
        ].concat(baseWebpackConfig.entry[name])
});

module.exports = merge(baseWebpackConfig, {
  // cheap-module-eval-source-map is faster for development
  devtool: "cheap-module-source-map",

  plugins: [
    new webpack.DefinePlugin({
      "process.env": config.dev.env
    }),
    new webpack.NoEmitOnErrorsPlugin(),

    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: "body"
    }),
    // 开启全局的模块热替换(HMR)
    new webpack.NamedModulesPlugin(chunk => {
      if (chunk.name) {
        return chunk.name;
      }
      return chunk
        .mapModules(m => path.relative(m.context, m.request))
        .join("_");
    }),
    // 当模块热替换(HMR)时在浏览器控制台输出对用户更友好的模块名字信息,
    new webpack.HotModuleReplacementPlugin(),

    // new CaseSensitivePathsPlugin(),
    // new ProgressBarPlugin(),
    // Moment.js is an extremely popular library that bundles large locale files
    // by default due to how Webpack interprets its code. This is a practical
    // solution that requires the user to opt into importing specific locales.
    // https://github.com/jmblog/how-to-optimize-momentjs-with-webpack
    // You can remove this if you don't use Moment.js:
    // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new FriendlyErrorsPlugin()
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  },
  // Turn off performance hints during development because we don't do any
  // splitting or minification in interest of speed. These warnings become
  // cumbersome.
  performance: {
    hints: false
  }
});

