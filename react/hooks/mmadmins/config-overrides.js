const { override, fixBabelImports,  addDecoratorsLegacy, disableEsLint} = require('customize-cra');
// prot: 3008
module.exports = override(
    addDecoratorsLegacy(),
    disableEsLint(),
    fixBabelImports('import', {
        libraryName:'antd',
        libraryDirectory: 'es',
        style: 'css'
    })
);
