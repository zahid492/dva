const path = require('path');

// 更明确的 web 端，不是node
function isWebTarget(caller) {
    return Boolean(caller && caller.target === 'web');
}

// 默认的浏览器端 webpack
function isWebpack(caller) {
    return Boolean(caller && caller.name === 'babel-loader');
}

// todo cra 多页面
// access the caller data that has been passed to Babel.
module.exports = api => {
    const node = api.caller(isWebTarget);
    const webpack = api.caller(isWebpack);

    // console.log("node: ", node, "webpack: ", webpack)

    return {
        presets: [
            ['@babel/preset-react'],

            [
                '@babel/preset-env',
                {
                    modules: webpack ? false : 'commonjs',
                    // usage
                    useBuiltIns: node ? 'entry' : undefined,
                    corejs: node ? 3 : false,
                    targets: node ? ['last 2 versions'] : { node: 'current' },
                    exclude: ['transform-typeof-symbol'],
                },
            ],
            // [require('@babel/preset-typescript').default]
        ],
        // "env": {
        //     "development": {
        //         "presets": [
        //             [
        //                 "@babel/preset-react",
        //                 {
        //                     "development": true
        //                 }
        //             ]
        //         ]
        //     }
        // },
        plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-syntax-dynamic-import',
            [
                require('@babel/plugin-transform-runtime').default,
                {
                    // react-preset false
                    corejs: 3,
                    helpers: false,
                    // By default, babel assumes babel/runtime version 7.0.0-beta.0,
                    // explicitly resolving to match the provided helper functions.
                    version: require('@babel/runtime/package.json').version,
                    regenerator: true,
                    // We should turn this on once the lowest version of Node LTS
                    // supports ES Modules.
                    useESModules: true,
                    // Undocumented option that lets us encapsulate our runtime, ensuring
                    // the correct version is used
                    absoluteRuntime: path.dirname(
                        require.resolve('@babel/runtime/package.json')
                    ),
                },
            ],
            // "@loadable/babel-plugin"
            // ["import", {
            //     "libraryName": "antd", // 引入库名称
            //     "libraryDirectory": "es", // 来源,default: lib
            //     "style": "css" // 全部,or 按需'css'
            // }]
        ],
        overrides: [
            // isTypeScriptEnabled && {
            //     test: /\.tsx?$/,
            //     plugins: [
            //         [
            //             require('@babel/plugin-proposal-decorators').default,
            //             { legacy: true },
            //         ],
            //     ],
            // },
        ],
    };
};
