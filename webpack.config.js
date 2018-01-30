module.exports = {
    entry: "./app.js",
    output: {
        path:  __dirname + '/build',
        filename: "bundle.js",
        publicPath:  "/build/"
    },
    resolve:{
        extensions: [".webpack.js", ".web.js", ".js", ".json", ".jsx"]
    },
    module: {
        loaders: [{
          test: /\.jsx?$/,         // Match both .js and .jsx files
          exclude: /node_modules/,
          loader: "babel-loader",
          query:
              {
                presets:["react", "es2015"]
              }
        },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },{
                test: /\.png$/,
                loader: "url-loader?limit=100000"
            },{
                test: /\.jpg$/,
                loader: "file-loader"
            },{
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/font-woff'
            },{
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=application/octet-stream'
            },{
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file'
            },{
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url?limit=10000&mimetype=image/svg+xml'
            }
        ]
    }
}