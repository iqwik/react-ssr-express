import path from 'path'
import express, { Request, Response } from 'express'
import compression from 'compression'
import serialize from 'serialize-javascript'

import React from 'react'
import { renderToString } from 'react-dom/server'
import { ChunkExtractor } from '@loadable/server'
import { minify } from 'html-minifier'

import { IAppSettings } from '../types/client'

/**
 * Can be e.g. your CDN Domain (https://cdn.example.com) in production with
 * `process.env.CDN_DOMAIN` for instance.
 */
const STATIC_URL = '/static/'

const nodeStats = path.resolve(__dirname, '../../dist/node/loadable-stats.json')
const webStats = path.resolve(__dirname, '../../dist/web/loadable-stats.json')

const app = express()

app
  .disable('x-powered-by')
  .use(compression())
  .use('/static', express.static(path.join(__dirname, '../../dist/web')))

app.get('*', (req: Request, res: Response) => {
  /**
   * node extractor is used for the server-side rendering
   * web extractor is used to get the browser-side compiled files.
   *
   * ## Learnings
   * - use `collectChunks` instead of `ChunkExtractorManager`. This was more
   *   reliable in my apps.
   * - Issue `<App />` is undefined -> resolved with `libraryTarget: 'commonjs2'`
   * in webpack.server.js config
   * @see https://github.com/gregberge/loadable-components/issues/620
   */
  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
  const { default: App } = nodeExtractor.requireEntrypoint()

  const webExtractor = new ChunkExtractor({
    statsFile: webStats,
    /**
     * has to be in sync with `__webpack_public_path__` (see src/client/path.ts)
     */
    publicPath: STATIC_URL,
  })

  const jsx = webExtractor.collectChunks(
    React.createElement(App as any, { url: req.url }),
  )
  const html = renderToString(jsx)
  const styles = webExtractor.getStyleTags()
  const scripts = webExtractor.getScriptTags()

  /**
   * Dynamic app settings created on the server and exposed with `window.app`
   * in the client.
   */
  const appContext: IAppSettings = {
    staticUrl: STATIC_URL,
  }

  res.set('content-type', 'text/html')
  res.send(minify(`
    <!doctype html>
    <html lang="en">
      <head>
        <title>loadable-components-example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <link rel="icon" href="static/assets/img/favicon.ico"/>
        ${styles}
      </head>
      <body>
        <div id="app">${html}</div>
        <script>
          ;window.app=${serialize(appContext)}
        </script>
        ${scripts}
      </body>
    </html>
  `, {
    removeComments:            true,
    collapseWhitespace:        true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes:     false,
    removeEmptyAttributes:     true,
    minifyJS:                  true,
    minifyCSS:                 true, 
  }))
})

app.listen(3000, () => {
  console.log('Running on http://localhost:3000/')
})
