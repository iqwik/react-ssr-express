const fileRegex = /\.(png|jpe?g|gif)(\?[a-z0-9#=&.]+)?$/i

module.exports = {
    loader: 'file-loader',
    test: fileRegex,
    options: {
        limit: 8192,
        esModule: false,
        outputPath: 'assets/img',
        name: '[contenthash].[ext]',
    },
    type: 'javascript/auto'
}

// const serverFileLoader = {
//     loader: 'null-loader',
//     test: fileRegex,
// }

// module.exports = {
//     clientFileLoader,
//     serverFileLoader,
// }
