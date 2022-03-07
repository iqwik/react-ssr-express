const fontRegex = /^(?!.*\.inline).*\.(svg|woff|woff2|eot|ttf|otf)(\?[a-z0-9#=&.]+)?$/

const clientFontLoader = {
    loader: 'url-loader',
    test: fontRegex,
    options: {
        limit: 8192,
        outputPath: 'assets/fonts'
    }
}

const serverFontLoader = {
    loader: 'null-loader',
    test: fontRegex,
}

module.exports = {
    clientFontLoader,
    serverFontLoader,
}
