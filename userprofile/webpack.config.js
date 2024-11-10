const path = require("path")
const webpack = require("webpack")

module.exports = {
    entry: "./src/server.js",
    mode: "development",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|browser_components|server})/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                use: 'file-loader?name=./images/[name].[ext]'
            }
        ]
    },
    resolve: {
        extensions: [".*", ".js", ".jsx"],
        fallback: {
            "async_hooks": false,
            "vm": false,
            "zlib": false,
            "querystring": false,
            'lib': false,
            'e-tag': false,
            "fs": false,
            "net": false,
            "http": require.resolve("stream-http"),
            "crypto": require.resolve("crypto-browserify"),
            "path": require.resolve("path-browserify"),
            "stream": require.resolve("stream-browserify"),
            "string_decoder": require.resolve("string_decoder/"),
            "util": require.resolve("util/"),
        }
    },
    output: {
        path: path.resolve(__dirname, "dist/"),
        publicPath: "/dist/",
        filename: "bundle.js"
    },
    devServer: {
        static: {
            directory: path.join(__dirname, "public/")
        },
        port: 3000,
        hot: true,
        proxy:[
            {
                context: ['/languages', '/translate'],
                target: 'http://localhost:8081'
            },
            {
                context: ['/api', '/logout'],
                target: 'http://localhost:5000'
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
}