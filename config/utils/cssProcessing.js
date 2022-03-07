const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const cacheLoader = require('./cacheLoader')

module.exports = ({ withModules = true, withNullLoader = false }) => (
    withNullLoader ? {
        test: /\.(c|sc|sa)ss?$/,
        loader: 'null-loader',
    } : {
        test: withModules ? /\.module\.(c|sc|sa)ss?$/ : /^((?!\.module).)*\.(c|sc|sa)ss?$/,
        use: [
            {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    esModule: false,
                },
            },
            { ...cacheLoader() },
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1,
                    modules: withModules ? { localIdentName: '[folder]__[local]__[hash:base64:6]' } : false,
                    sourceMap: true,
                },
            },
            {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: ['autoprefixer', 'postcss-preset-env'],
                    },
                },
            },
            {
                loader: 'sass-loader',
                options: {
                    implementation: 'node-sass',
                    sourceMap: true,
                },
            },
            // {
            //     loader: 'sass-resources-loader',
            //     options: {
            //         resources: sassResources,
            //     },
            // },
        ],
    }
)
