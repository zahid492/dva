import path from 'path';
import fs from 'fs';
import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { ChunkExtractor } from '@loadable/server';

const app = express();

// 其它请求路径返回对应的本地文件
app.use(express.static(path.resolve(__dirname, '../dist')));
// 调用构建出的 bundle_server.js 中暴露出的渲染函数，再拼接下 HTML 模版，形成完整的 HTML 文件

if (process.env.NODE_ENV !== 'production') {
    const webpackConfig = [
        require('../config/webpack.dev.config.js'),
        require('../config/webpack.server.config.js'),
    ];

    const fpath = path.resolve(__dirname, '../webConfig.js');
    console.log(fpath);

    if (!fs.existsSync(fpath)) {
        fs.writeFileSync(fpath, JSON.stringify(webpackConfig), err => {
            if (err) {
                throw err;
            }
            console.log('配置已写入:', fpath);
        });
    }

    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpack = require('webpack');

    const compiler = webpack(webpackConfig);

    app.use(
        webpackDevMiddleware(compiler, {
            logLevel: 'silent',
            publicPath: '/web',

            writeToDisk(filePath) {
                console.log('write to dist:', filePath);
                return (
                    /dist\\node\\/.test(filePath) ||
                    /loadable-stats/.test(filePath)
                );
            },
        })
    );
}

const nodeStats = path.resolve(__dirname, '../dist/node/loadable-stats.json');
const webStats = path.resolve(__dirname, '../dist/web/loadable-stats.json');

app.get('*', (req, res) => {
    const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
    const { default: App } = nodeExtractor.requireEntrypoint();

    const webExtractor = new ChunkExtractor({ statsFile: webStats });
    const jsx = webExtractor.collectChunks(<App />);

    const fpath = path.resolve(__dirname, '../jsx.js');

    if (!fs.existsSync(fpath)) {
        fs.writeFileSync(fpath, JSON.stringify(jsx), err => {
            if (err) {
                throw err;
            }
            console.log('jsx已写入:', fpath);
        });
    }
    const html = renderToString(jsx);

    res.set('content-type', 'text/html');
    res.send(`
          <!DOCTYPE html>
          <html>
            <head>
            ${webExtractor.getLinkTags()}
            ${webExtractor.getStyleTags()}
            </head>
            <body>
                <div id="app">${html}</div>
                ${webExtractor.getScriptTags()}
            </body>
           </html>
    `);
});

app.listen(3000, function () {
    console.log('server started http://localhost:3000');
});
