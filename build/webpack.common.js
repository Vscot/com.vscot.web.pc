const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const env = process.env.NODE_ENV;

module.exports = {
  entry: path.join(__dirname, "../src/index.tsx"),
  output: {
    filename: "js/[name].[hash].js",
    path: path.join(__dirname, "../dist"),
    publicPath: '/'
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", "jsx"],
    alias: {
      "@": path.resolve(__dirname, "../src/") // 以 @ 表示src目录
    }
  },
  stats: {
    colors: true,
    children: false,
    chunks: false,
    chunkModules: false,
    modules: false,
    builtAt: false,
    entrypoints: false,
    assets: false,
    version: false
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        use: [{ loader: "babel-loader" }, { loader: "ts-loader" }],
        include: path.join(__dirname, "../src"),
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          {
            loader:
              env === "production"
                ? MiniCssExtractPlugin.loader
                : "style-loader",
            options: env === "production" ? { publicPath: "../" } : {}
          },
          {
            loader: "css-loader",
            options: {
              modules: false // 如果要启用css modules，改为true即可
            }
          },
          "postcss-loader"
        ]
      },
      //  自定义less文件处理
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          {
            loader:
              env === "production"
                ? MiniCssExtractPlugin.loader
                : "style-loader",
            options: env === "production" ? { publicPath: "../" } : {}
          },
          {
            loader: "css-loader",
            options: {
              modules: true // 如果要启用css modules，改为true即可
            }
          },
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      //  处理antd less
      {
        test: /\.less$/,
        exclude: path.resolve(__dirname, "../src"),
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              importLoaders: 1
            }
          },
          "postcss-loader",
          {
            loader: "less-loader",
            options: {
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              //1024 == 1kb
              //小于10kb时打包成base64编码的图片否则单独打包成图片
              limit: 10240,
              name: path.join("img/[name].[hash:7].[ext]")
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10240,
              name: path.join("font/[name].[hash:7].[ext]")
            }
          }
        ]
      }
    ]
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
    })
  ]
};
