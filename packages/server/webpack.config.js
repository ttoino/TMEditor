const webpack = require('webpack')
const path = require('path')
const nodeExternals = require('webpack-node-externals')
const WebpackShellPluginNext = require('webpack-shell-plugin-next')

module.exports = (env, argv) => ({
  entry: './src/app.ts',
  target: 'node',
  devtool: 'source-map',
  watch: argv.mode === 'development',
  watchOptions: argv.mode === 'development' ? { ignored: /models/ } : {},
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@app': path.resolve(__dirname, './src/')
    }
  },
  module: {
    parser: {
      javascript: {
        // required to enable webpack magic comments when using ts-loader
        commonjsMagicComments: true
      }
    },
    rules: [
      {
        test: /\.ts$/,
        use: [{
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        }]
      }
    ]
  },
  externalsPresets: { node: true },
  externals: [
    nodeExternals()
  ],
  plugins: [
    argv.mode === 'development' && new WebpackShellPluginNext({
      onBuildEnd: {
        scripts: ['yarn run:nodemon'],
        blocking: false,
        parallel: true
      }
    })
  ].filter(p => p)

})
