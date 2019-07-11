module.exports = {
    // 无用
    overrideCracoConfig: ({ cracoConfig, pluginOptions, context }) => {
        // console.log("context:", context)
        console.log("pluginOptions:", pluginOptions)
        console.log("cracoConfig:", JSON.stringify(cracoConfig.plugins))

        if (!cracoConfig.babel) cracoConfig.babel = {};
        if (!cracoConfig.babel.plugins) cracoConfig.babel.plugins = [];

        cracoConfig.babel.plugins.push(["mobx"]);

        return cracoConfig;
    }
};