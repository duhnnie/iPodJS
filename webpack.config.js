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
    library: 'iPodJS',
    libraryTarget: 'var'
  },
  externals: {
    lodash: '_'
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
        use: ExtractTextPlugin.extract('css-loader?modules&importLoaders=1&localIdentName=[path][name]__[local]___[hash:base64:5]')
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin('ipodjs.css')
  ]
};

let specificConf;

if (env === 'dev') {
  specificConf = {
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      watchContentBase: true,
      compress: true,
      port: 8080
    },
    devtool: 'inline-source-map'
  };
} else {
  specificConf = {
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
