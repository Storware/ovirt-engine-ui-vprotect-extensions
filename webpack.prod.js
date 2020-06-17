// const path = require('path')

const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  mode: 'production',
  devtool: 'source-map',

  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(js|jsx)$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader', // options from __.babelrc.js__
        },
      },
      {
        test: /\.(ts|tsx)$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'ts-loader', // options from __.babelrc.js__
        },
      },

      // inline base64 URLs for <= 8k images, direct URLs for the rest
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            name: 'media/[name].[hash:8].[ext]',
          },
        },
      },

      // embed the woff2 fonts and any fonts that are used by the PF icons
      // directly in the CSS (to avoid lag applying fonts), export the rest
      // to be loaded seperately as needed
      {
        test: (fontsToEmbed = [
          /\.woff2(\?v=[0-9].[0-9].[0-9])?$/,
          /PatternFlyIcons-webfont\.ttf/,
        ]),
        use: {
          loader: 'url-loader',
          options: {},
        },
      },
      {
        test: /\.(ttf|eot|svg|woff(?!2))(\?v=[0-9].[0-9].[0-9])?$/,
        exclude: fontsToEmbed,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:8].[ext]',
          },
        },
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
    })
  ],

  bail: true,

  entry: {
    plugin: './src/integrations/plugin.js',
    index: './src/index.tsx',
  },

  resolve: {
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'), // TODO: Still needed?
      _: path.join(__dirname, 'src'),
      components: path.resolve(__dirname, 'src/components/'),
      model: path.resolve(__dirname, 'src/model/'),
      pages: path.resolve(__dirname, 'src/pages/'),
      services: path.resolve(__dirname, 'src/services/'),
      store: path.resolve(__dirname, 'src/store/'),
      utils: path.resolve(__dirname, 'src/utils/'),
      integrations: path.resolve(__dirname, 'src/integrations/'),
    },
    extensions: ['.ts', '.tsx', '.js', '.jsx', '*'],
  }
}

