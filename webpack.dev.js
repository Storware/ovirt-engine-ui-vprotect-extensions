const { merge } = require('webpack-merge');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

/**
 * @type {import('webpack').Configuration}
 */
module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  watchOptions: {
    ignored: /node_modules/,
  },
  devServer: {
    static: './dist/dev',
    devMiddleware: { writeToDisk: true },
    historyApiFallback: {
      index: 'index.html',
    },
    client: {
      logging: 'none',
      overlay: false,
      progress: true,
    },
    proxy: [
      {
        context: ['/api'],
        // target: 'https://10.61.60.134',
        target: 'https://10.61.29.203',
        secure: false,
        changeOrigin: true,
        ws: true,
      },
      // (req, res, next) => {
      //   // res.setHeader('3rd-Party-Project', '59c8012449df4a5dbc66e84d63215188');
      //   // next();
      // },
    ],
  },
  entry: {
    index: path.join(__dirname, './src/index.tsx'),
  },
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
          loader: 'ts-loader',
        },
      },

      // inline base64 URLs for <= 8k images, direct URLs for the rest
      {
        type: 'javascript/auto',
        test: /\.(png|jpg|jpeg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 8192,
            name: 'media/[name].[hash:8].[ext]',
          },
        },
      },

      // embed the woff2 fonts and any fonts that are used by the PF icons
      // directly in the CSS (to avoid lag applying fonts), export the rest
      // to be loaded seperately as needed
      {
        type: 'javascript/auto',
        test: (fontsToEmbed = [
          /\.woff2(\?v=[0-9].[0-9].[0-9])?$/,
          /PatternFlyIcons-webfont\.ttf/,
        ]),
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
          },
        },
      },
      {
        type: 'javascript/auto',
        test: /\.(ttf|eot|svg|woff(?!2))(\?v=[0-9].[0-9].[0-9])?$/,
        exclude: fontsToEmbed,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
            name: 'fonts/[name].[hash:8].[ext]',
          },
        },
      },
      {
        type: 'javascript/auto',
        test: /\.(svg|ttf|eot|woff|woff2)$/,
        // only process modules with this loader
        // if they live under a 'fonts' or 'pficon' directory
        include: [
          path.resolve(__dirname, 'node_modules/patternfly/dist/fonts'),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-core/dist/styles/assets/fonts',
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/react-core/dist/styles/assets/pficon',
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/patternfly/assets/fonts',
          ),
          path.resolve(
            __dirname,
            'node_modules/@patternfly/patternfly/assets/pficon',
          ),
        ],
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
            // Limit at 50k. larger files emited into separate files
            limit: 5000,
            outputPath: 'fonts',
            name: '[name].[ext]',
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      components: path.resolve(__dirname, 'src/components/'),
      model: path.resolve(__dirname, 'src/model/'),
      pages: path.resolve(__dirname, 'src/pages/'),
      services: path.resolve(__dirname, 'src/services/'),
      store: path.resolve(__dirname, 'src/store/'),
      utils: path.resolve(__dirname, 'src/utils/'),
      integrations: path.resolve(__dirname, 'src/integrations/'),
      [path.resolve(__dirname, 'src/App.tsx')]: path.resolve(
        __dirname,
        'src/integrations/dev/App.tsx',
      ),
    },
  },

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Development',
      filename: 'index.html',
      template: 'static/html/index.template.ejs',
      inject: true,
      chunks: ['webpack-manifest', 'vendor', 'index'],
    }),
    new ESLintPlugin({
      configType: 'flat',
      files: ['./src/!**!/!*.ts'],
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist/dev'),
    publicPath: '/',
  },
};
