const path = require('path');
const webpack = require('webpack');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

const cwd = process.cwd();

module.exports = options => ({
  entry: {
    'rs-carousel': path.join(cwd, 'src/index.js'),
  },

  output: Object.assign({
    path: path.join(cwd, 'lib'),
    library: 'rsCarousel',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  }, options.output),

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
    ],
  },

  plugins: options.plugins.concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),

    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3000,
      server: {
        baseDir: cwd,
      },
    }),
  ]),

  resolve: {
    modules: ['src', 'node_modules'],
  },

  externals: {
    'jquery': 'jQuery',
  },

  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
  stats: {
    assets: true,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
  },
});
