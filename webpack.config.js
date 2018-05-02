const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const env = process.env.WEBPACK_ENV;

const basic_conf = {
    mode: env === 'dev' ? 'development' : 'production',
    entry: './src/BaseElement.js',
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

let specific_conf;

if (env === 'dev') {
    specific_conf = {
        devServer: {
            contentBase: path.join(__dirname, 'dist'),
            compress: true,
            port: 8080
        },
        devtool: 'inline-source-map'
    };
} else {
    specific_conf = {
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

module.exports = merge(basic_conf, specific_conf);
