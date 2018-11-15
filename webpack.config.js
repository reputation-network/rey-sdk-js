const path = require("path");
const webpack = require("webpack");
const version = process.env.npm_package_version || require("./package.json").version;

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist/"),
    filename: "rey-sdk.js",
    library: "REY",
    libraryTarget: "umd"
  },
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".ts", ".js" ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `REY-SDK v${version}#[hash]`
    })
  ]
};
