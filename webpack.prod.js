// const path = require('path')

const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');

const env = process.env.NODE_ENV || 'development';
const useFakeData = process.env.FAKE_DATA === 'true';
const packageInfo = require('./package.json');

// common modules required by all entry points
const commonModules = ['core-js/stable'];


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
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/vprotect-resources'),

    // UI plugin resources are served through Engine
    publicPath: '/ovirt-engine/webadmin/plugin/vprotect/',
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

    new webpack.ProvidePlugin({
      jQuery: 'jquery', // Bootstrap's JavaScript implicitly requires jQuery global
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env),
      },
      __DEV__: JSON.stringify(env === 'development'),
    }),

    new CleanWebpackPlugin({
      verbose: false,
    }),
    new CopyWebpackPlugin([
      {
        from: 'static/vprotect.json',
        to: '../',
        transform: (content) =>
          content.toString().replace('"__FAKE_DATA__"', useFakeData),
      },
    ]),

    new HtmlWebpackPlugin({
      filename: 'plugin.html',
      template: 'static/html/plugin.template.ejs',
      inject: true,
      chunks: ['webpack-manifest', 'vendor', 'plugin'],
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'static/html/index.template.ejs',
      inject: true,
      chunks: ['webpack-manifest', 'vendor', 'index'],
    }),
    new InlineManifestWebpackPlugin('webpack-manifest'),

    // This pulls all of the depends on modules out of the entry chunks and puts them
    // together here.  Every entry then shares this chunk and it can be cached between
    // them.  The HtmlWebpackPlugins just need to reference it so the script tag is
    // written correctly.  HashedModuleIdsPlugin keeps the chunk id stable as long
    // as the contents of the chunk stay the same (i.e. no new modules are used).
    new webpack.HashedModuleIdsPlugin(),
  ],

  bail: true,

  entry: {
    plugin: [...commonModules, './src/integrations/plugin.js'],
    index: [...commonModules, './src/index.tsx'],
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

