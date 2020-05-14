const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

let fontsToEmbed

// development mode
// @see https://github.com/patternfly/patternfly-react-seed/blob/master/webpack.dev.js
module.exports = {
    mode: 'development',
    devtool: 'eval-source-map',
    devServer: {
      contentBase: './dist',
      writeToDisk: true,
      historyApiFallback: {
        index: 'index.html'
      }
    },
    entry: {
      index: './src/index.js'
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(js|jsx)$/,
          include: path.resolve(__dirname, 'src'),
          use: {
            loader: 'babel-loader' // options from __.babelrc.js__
          }
        },

        // inline base64 URLs for <= 8k images, direct URLs for the rest
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'media/[name].[hash:8].[ext]'
            }
          }
        },

        // embed the woff2 fonts and any fonts that are used by the PF icons
        // directly in the CSS (to avoid lag applying fonts), export the rest
        // to be loaded seperately as needed
        {
          test: fontsToEmbed = [
            /\.woff2(\?v=[0-9].[0-9].[0-9])?$/,
            /PatternFlyIcons-webfont\.ttf/
          ],
          use: {
            loader: 'url-loader',
            options: {}
          }
        },
        {
          test: /\.(ttf|eot|svg|woff(?!2))(\?v=[0-9].[0-9].[0-9])?$/,
          exclude: fontsToEmbed,
          use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[hash:8].[ext]'
            }
          }
        }
      ]
    },

    plugins: [
      // new CleanWebpackPlugin(['dist/*']) for < v2 versions of CleanWebpackPlugin
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Development',
        filename: 'index.html',
        template: 'static/html/index.template.ejs',
        inject: true,
        chunks: ['webpack-manifest', 'vendor', 'index']
      })
    ],
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    }
}
