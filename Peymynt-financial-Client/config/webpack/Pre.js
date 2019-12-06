'use strict';

/**
 * Dist configuration. Used to build the
 * final output when running npm run dist.
 */
const webpack = require("webpack")
const path = require("path")
const moment = require("moment");
const WebpackBaseConfig = require("./Base")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin")
const dotenv = require('dotenv');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const ROOT = path.resolve(__dirname, "../..")

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ROOT].concat(args));
}

class WebpackDistConfig extends WebpackBaseConfig {

  constructor() {
    const env = dotenv.config({ path: '.env.pre' }).parsed;
    super();

    let envKeys = Object.keys(env).reduce((prev, next) => {
      prev[`process.env.${next}`] = JSON.stringify(env[next]);
      return prev;
    }, {});

    envKeys[`process.env.NODE_ENV`] = JSON.stringify('production');
    let displayDate = moment().utc();
    displayDate.add(-750, 'minutes');
    displayDate = displayDate.format('MM-DD HH:mm:ss');
    console.log("Build version : " + displayDate);

    envKeys[`process.env.BUILD_VERSION`] = JSON.stringify(`${displayDate}`);
    console.log("envKeys", envKeys);
    this.config = {
      cache: false,
      devtool: 'source-map',
      entry: [
        './client.js'
      ],
      output: {
        path: root('dist'),
        filename: "assets/[name].[hash].bundle.js",
        sourceMapFilename: "assets/[name].[chunkhash].bundle.map",
        chunkFilename: "assets/[name].[chunkhash].chunk.js",
        publicPath: "/"
      },
      plugins: [
        new UglifyJSPlugin(),
        new webpack.DefinePlugin(envKeys),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // new webpack.ProvidePlugin( {
        //   $:"jquery",
        //   jQuery:"jquery",
        //   "window.jQuery":"jquery"
        // }),
        new ExtractTextPlugin({
          filename: "css/[name].[contenthash].styles.css"
        }),
        new CopyWebpackPlugin([
          { from: root('public/index.html'), to: root('dist/') },
          { from: root('public/favicon2.ico'), to: root('dist/') },
          { from: root('public/vendors'), to: root('dist/vendors') },
          { from: root('src/assets'), to: root('dist/assets') },
          { from: root('src/fonts'), to: root('dist/fonts') }
        ]),
        new HtmlWebpackPlugin({
          template: path.resolve(root("src"), "index.html"),
          chunksSortMode: "dependency"
        }),
        new ScriptExtHtmlWebpackPlugin({
          defaultAttribute: "defer"
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: ["vendor", "manifest"],
          filename: "assets/[name].[hash].js",
          minChunks: Infinity
        })
      ]
    };

    // Deactivate hot-reloading if we run dist build on the dev server
    this.config.devServer.hot = false;

    this.config.module.rules = this.config.module.rules.concat([
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          cacheDirectory: true,
          presets: ['react', 'es2015']
        }
      }, {
        test: /\.scss$/,
        //use: ['style-loader', 'css-loader']
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          //use: "css-loader"
          use: ['css-loader', 'sass-loader']
        })
      },

      {
        test: /^.((?! cssmodule).) * \.(sass | scss)$/,
        loaders: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }
        ]
      }, {
        test: /^.((?! cssmodule).) * \.less$/,
        loaders: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'less-loader' }
        ]
      }
    ])
  }

  /**
   * Get the environment name
   * @return {String} The current environment
   */
  get env() {
    return 'pre';
  }
}

module.exports = WebpackDistConfig;
