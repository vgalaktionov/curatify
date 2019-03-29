const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    main: './client/index.tsx',
    login: './client/login.js',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './client/index.html'
    }),
    new HtmlWebpackPlugin({
      template: './client/login.html'
    }),
    new CopyWebpackPlugin([{
      from: './client/static',
      to: './static'
    }])
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'build/[name].[contenthash].js'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  module: {
    rules: [{
        test: /\.tsx?$/,
        loader: 'ts-loader'
      }, {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'file-loader',
          options: {},
        }, ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  }
}
