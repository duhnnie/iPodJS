const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const env = process.env.WEBPACK_ENV;

const basicConf = {
  mode: env === 'dev' ? 'development' : 'production',
  entry: './src/js/iPod.js',
  output: {
    filename: 'ipod.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    library: 'iPodJS',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        include: path.join(__dirname, 'src/js'),
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      },
      {
        test: /\.css$/,
        include: path.join(__dirname, 'src/css'),
        use: ExtractTextPlugin.extract('css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]')
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        loader: 'url-loader',
        include: path.join(__dirname, 'src/img'),
        options: {
          limit: 8000,
          name: './img/[name].[ext]'
        }
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin('iPodJS | (c) Duhnnie (Daniel Canedo) | http://duhnnie.net | https://github.com/duhnnie/iPodJS'),
    new ExtractTextPlugin('./ipodjs.css')
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
    externals: {
      lodash: '_'
    },
    devtool: 'source-map',
    plugins: [
      new UglifyJSPlugin({
        sourceMap: true
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
      })
    ]
  };
}

module.exports = merge(basicConf, specificConf);
