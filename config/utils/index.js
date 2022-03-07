const cssProcessing = require('./cssProcessing')
const fileLoader = require('./fileLoader')
const { clientFontLoader, serverFontLoader } = require('./fontLoader')

const getRules = (target) => {
    return (
        target === 'node' ? [
            cssProcessing({ withNullLoader: true }),
            fileLoader,
            serverFontLoader,
        ] : [
            cssProcessing({ withModules: false }),
            cssProcessing({ withModules: true }),
            fileLoader,
            clientFontLoader,
        ]
    )
}

module.exports = getRules
