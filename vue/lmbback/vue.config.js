// const WorkboxPlugin = require('workbox-webpack-plugin');

module.exports = {
    // configureWebpack: {
    //     plugins: [
    //         new WorkboxPlugin.GenerateSW({
    //             importWorkboxFrom:"local",
    //             importsDirectory: 'public',
    //             cacheId: 'ff-pwa', // 设置前缀
    //             skipWaiting: true, // 强制等待中的 Service Worker 被激活
    //             clientsClaim: true, // Service Worker 被激活后使其立即获得页面控制权
    //             swDest: 'service-wroker.js', // 输出 Service worker 文件
    //             globPatterns: ['**/*.{html,js,css,png.jpg}'], // 匹配的文件
    //             globIgnores: ['service-wroker.js'], // 忽略的文件
    //             runtimeCaching: [
    //                 // 配置路由请求缓存
    //                 {
    //                     urlPattern: /.*\.js/, // 匹配文件
    //                     handler: 'networkFirst', // 网络优先
    //                     options: {
    //                         networkTimeoutSeconds: 10,
    //                         // Use a custom cache name for this route.
    //                         cacheName: 'ff-api-cache',
    //                         // Configure custom cache expiration.
    //                         expiration: {
    //                             maxEntries: 5,
    //                             maxAgeSeconds: 60,
    //                         },
    //                         // Configure background sync.
    //                         backgroundSync: {
    //                             name: 'my-queue-name',
    //                             options: {
    //                                 maxRetentionTime: 60 * 60,
    //                             },
    //                         },
    //                     }
    //                 }
    //             ]
    //         })
    //     ]
    //
    // }
    devServer: {
        host: 'localhost',
        port: 4001,
        https: false,
        open: true,
        headers:{
            "Access-Control-Allow-Origin":"*"
        },
        proxy: {
            '/api': {
                target: 'http://191.167.20.217:1001/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        }
    }
};