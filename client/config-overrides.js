/* config-overrides.js */
const {
    override,
    addLessLoader,
    addWebpackModuleRule,
} = require('customize-cra');

module.exports = override(
    addLessLoader({
        lessOptions: {
            javascriptEnabled: true,
            modifyVars: {
                '@base-color': '#7e8ab8',
                '@body-bg': '#080135',
                '@primary-bg-color': '#140e3f',
                '@B800': '#140e3f',
                '@B700': '#1e1847',
                '@B600': '#342e58',
                '@B500': '#342e58',
                '@B400': '#322c57',
                '@B200': '#676383',
                '@B100': '#2b2653',
                '@headings-color': '#4274f8',
            },
        },
    })
    /*     addWebpackModuleRule({
        test: /\.svg$/,
        use: [{
            loader: 'svg-sprite-loader',
            options: {
                symbolId: 'icon-[name]'
            }
        }]
    }) */
);
