const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const env = process.env.WEBPACK_ENV;

const basicConf = {
  mode: env === 'dev' ? 'development' : 'production',
  entry: './src/iPod.js',
  output: {
    filename: 'ipod.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'iPodJS',
    libraryTarget: 'var'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    ]
  }
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
