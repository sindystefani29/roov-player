const path = require("path");
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: 'production',

    entry:  './src/index.js',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'roov'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules)/
            }
        ]
    },

    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin()],
    }
};