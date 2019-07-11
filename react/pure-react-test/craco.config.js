
const mobxBabelPresets = require("babel-preset-mobx")();
const lodashPlugin = require("./config/lodash.config");
const devServerPlugin = require("./config/devserver.config");


module.exports = {
    plugins: [
        {plugin: lodashPlugin},
        {plugin: devServerPlugin}
    ],
    babel: {
        plugins: [
            ...mobxBabelPresets.plugins
        ]
    },
};