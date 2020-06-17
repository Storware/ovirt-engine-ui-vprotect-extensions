// const path = require('path')
const util = require('util');
const merge = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.common.js');

// productions mode
// @see https://github.com/patternfly/patternfly-react-seed/blob/master/webpack.prod.js
async function prod() {
  // let cssToExtract

  const prodConfig = merge(await common, {
    mode: 'production',
    devtool: 'source-map',

    module: {
      rules: [
        {
          test: /\.(css|scss)$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },

    output: {
      filename: 'js/[name].[chunkhash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].chunk.js',
    },

    optimization: {
      minimizer: [
        new TerserPlugin({
          // minify JS with source maps
          cache: true,
          parallel: true,
          sourceMap: true,
        }),
        new OptimizeCSSAssetsPlugin({
          // minify CSS with source maps
          cssProcessorOptions: {
            map: {
              inline: false,
              annotation: true,
            },
          },
        }),
      ],
    },

    plugins: [
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[name].[contenthash:8].chunk.css',
      }),
    ],
  });

  if (!process.env.Q) {
    console.log('production webpack configuration:');
    console.log(
      util.inspect(prodConfig, {
        compact: false,
        breakLength: 120,
        depth: null,
        colors: true,
      }),
    );
  }
  return prodConfig;
}
module.exports = prod();
