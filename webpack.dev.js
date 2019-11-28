const util = require('util')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

// development mode
// @see https://github.com/patternfly/patternfly-react-seed/blob/master/webpack.dev.js
async function dev () {
  const devConfig = merge(await common, {
    mode: 'development',
    devtool: 'eval-source-map',

    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },

    plugins: []
  })

  if (!process.env.Q) {
    console.log('development webpack configuration:')
    console.log(util.inspect(devConfig, { compact: false, breakLength: 120, depth: null, colors: true }))
  }
  return devConfig
}
module.exports = dev()
