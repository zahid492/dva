const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const development =
    !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

module.exports = {
    mode: development ? 'development' : 'production',
    entry: {
        libs: ['react', 'react-dom'],
    },
    output: {
        path: path.join(__dirname, '../dist/dll'),
        filename: '[name].dll.js',
        library: 'dll_[name]',
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, '../dist/dll', '[name]-manifest.json'),
            // name属性值需要和 output.library保存一致，该字段值是输出的 manifest.json文件中name字段的值。
            name: 'dll_[name]',
            // context: path.join(__dirname, "../public/dll")
            context: process.cwd(),
        }),

        // 清除 dist 输出目录，有 dll 不清楚，暂时手动
        new CleanWebpackPlugin({
            // 输出日志
            // verbose: true,
            // true 模拟删除
            dry: true,
        }),
    ],
};
