const webpack = require('webpack');

module.exports = require('./webpack.base')({
  output: {
    filename: '[name].min.js',
    chunkFilename: '[name].chunk.min.js',
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),

    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: false,
    }),
  ],
});
