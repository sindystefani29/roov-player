const path = require("path");

module.exports = {
    mode: 'development',

    entry:  './src/index.js',

    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'roov',
        libraryTarget: 'umd',
        globalObject: "typeof self !== 'undefined' ? self : this"
    },

    devtool: 'inline-source-map',

    devServer: {
        contentBase: './dist',
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader",
                exclude: /(node_modules)/
            }
        ]
    }
};