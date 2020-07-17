const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const env = process.env.WEBPACK_ENV;

const basicConf = {
  mode: env === 'dev' ? 'development' : 'production',
  entry: './src/js/index.js',
  output: {
    filename: 'ipod.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    library: 'iPodJS',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        // include: path.join(__dirname, 'src/js'),
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        include: path.resolve(__dirname, 'src/sass'),
        use: [
          MiniCssExtractPlugin.loader, // 'style-loader',
          'css-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        loader: 'file-loader',
        include: path.join(__dirname, 'src/img'),
        options: {
          limit: 8000,
          name: './img/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.BannerPlugin('iPodJS | (c) Duhnnie (Daniel Canedo) | http://duhnnie.net | https://github.com/duhnnie/iPodJS'),
    new MiniCssExtractPlugin({
      filename: 'ipodjs.css',
    }),
  ]
};

let specificConf;

if (env === 'dev') {
  specificConf = {
    devServer: {
      contentBase: __dirname,
      watchContentBase: false,
      compress: true,
      port: 8080
    },
    devtool: 'inline-source-map'
  };
} else {
  specificConf = {
    devtool: 'source-map',
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  };
}

module.exports = merge(basicConf, specificConf);
