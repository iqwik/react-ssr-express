const path = require('path')

const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const LoadablePlugin = require('@loadable/webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { createLoadableComponentsTransformer } = require('typescript-loadable-components-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const getRules = require('./utils')

const DIST_PATH = path.resolve(__dirname, '../dist')

const production = process.env.NODE_ENV === 'production'
const development = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

console.log({ production, development })

module.exports = (target) => ({
  name: target,
  mode: development ? 'development' : 'production',
  devtool: development ? 'cheap-module-source-map' : undefined,
  target: target,
  resolve: {
    alias: {
      '@assets': path.resolve(__dirname, '../src/client/assets'),
      '@components': path.resolve(__dirname, '../src/client/components'),
      '@pages': path.resolve(__dirname, '../src/client/pages')
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  entry: path.resolve(__dirname, '../src/client/main-' + target + '.tsx'),
  output: {
    filename: production ? 'js/[name].js' : '[name].js',
    path: path.join(DIST_PATH, target),
    publicPath: '/static/',
  },
  optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					test: /node_modules/,
					chunks: 'initial',
					name: 'vendors',
					enforce: true,
				},
			},
		},
    minimize: production,
		minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              // caller is used in babel-config for further optimisations
              caller: { target },
            },
          },
          {
            loader: 'ts-loader',
            options: {
              getCustomTransformers: (program) => ({
                before: [createLoadableComponentsTransformer(program, {})],
              }),
              transpileOnly: true,
            },
          },
        ],
      },
      ...getRules(target),
    ],
  },
  plugins: [
    new LoadablePlugin(),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        diagnosticOptions: {
          semantic: true,
          syntactic: true,
        },
      },
    }),
    new CleanWebpackPlugin({
      /**
       * during rebuilds (watch mode) we do not clean old files
       * @see https://github.com/johnagan/clean-webpack-plugin/issues/152#issuecomment-509028712
       */
      cleanStaleWebpackAssets: false,
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(__dirname, '../src/client/assets/static'), to: path.join(DIST_PATH, target, 'assets') },
      ],
    }),
    new webpack.WatchIgnorePlugin({
      paths: [/\.js$/, /\.d\.ts$/],
    }),
    new MiniCssExtractPlugin({
      filename: development ? '[name].css' : 'styles/[name].css',
    }),
  ],
  performance: {
    hints: development ? false : 'warning',
  },
  watchOptions: {
    aggregateTimeout: 1000,
    poll: (process.platform === 'linux' && 1000) || false, // make --watch work on linux
    ignored: ['node_modules', 'dist', 'lib'],
  },
})
