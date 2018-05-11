var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

let config = {
    context: __dirname,

    devtool: debug ? "inline-sourcemap" : false,
    plugins: debug ? [] : [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin({
          mangle: false,
          sourcemap: false
        }),
    ],
    module: {
        rules: [
            { test: /\.js$/, loader: "babel-loader" }
        ]
    },
    entry: "./src/app.js",
    output: {
        path: __dirname + "/dist/js",
        filename: "app.min.js",
        libraryTarget: 'amd'
    }
};

module.exports = config;