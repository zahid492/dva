const { override, fixBabelImports,  addDecoratorsLegacy, disableEsLint} = require('customize-cra');

module.exports = override(
    addDecoratorsLegacy(),
    disableEsLint(),
    fixBabelImports('import', {
        libraryName:'antd',
        libraryDirectory: 'es',
        style: 'css'
    })
);
