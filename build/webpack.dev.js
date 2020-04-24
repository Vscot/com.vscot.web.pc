const webpack = require("webpack");
const path = require("path");
const merge = require("webpack-merge");
const baseConfig = require("./webpack.common");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");

const devConfig = {
  mode: "development",
  devtool: "eval-source-map",
  watch: true,
  watchOptions: {
    // 排除监听
    ignored: /node_modules/,
    // 监听到变化发生后，延迟 300ms（默认） 再去执行动作，
    // 防止文件更新太快导致重新编译频率太高
    aggregateTimeout: 300,
    // 判断文件是否发生变化是通过不停的去询问系统指定文件有没有变化实现的
    // 默认 1000ms 询问一次
    poll: 1000
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, "../public/index.html"),
      inject: true,
      minify: {
        removeComments: true, // 去掉注释
        collapseWhitespace: true, // 去掉多余空白
        removeAttributeQuotes: true // 去掉一些属性的引号，例如id="moo" => id=moo
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: ["You application is running here http://localhost:3001"]
      },
      onErrors: function(severity, errors) {
        // You can listen to errors transformed and prioritized by the plugin
        // severity can be 'error' or 'warning'
      },
      // should the console be cleared between each compilation?
      // default is true
      clearConsole: true,

      // add formatters and transformers (see below)
      additionalFormatters: [],
      additionalTransformers: []
    })
  ],
  devServer: {
    host: "localhost",
    port: 3000,
    historyApiFallback: true,
    overlay: {
      //当出现编译器错误或警告时，就在网页上显示一层黑色的背景层和错误信息
      errors: true
    },
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:7000",
    //     pathRewrite: { "^/api": "" },
    //     changeOrigin: true,
    //     secure: false // 接受 运行在 https 上的服务
    //   }
    // },
    inline: true,
    hot: true,
    clientLogLevel: "error",
    noInfo: true,
    stats: "errors-only",
    quiet: true,
    publicPath: '/',
    contentBase: path.join(__dirname, "../src")
  }
};

const finalConfig = merge(baseConfig, devConfig);

module.exports = finalConfig;
