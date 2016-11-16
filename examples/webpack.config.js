const path = require('path');
const webpack = require('webpack');

const cwd = process.cwd();

module.exports = {
  entry: {
    'es6_basic/bundle': path.join(cwd, 'es6_basic/app.js'),
    'es6_horizontal/bundle': path.join(cwd, 'es6_horizontal/app.js'),
    'es6_controls/bundle': path.join(cwd, 'es6_controls/app.js'),
    'es6_custom_effects/bundle': path.join(cwd, 'es6_custom_effects/app.js'),
  },

  output: {
    path: './',
    filename: '[name].js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /(node_modules)/,
        query: {
          presets: ['es2015'],
        },
      },
    ],
  },

  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),

    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
    }),

    new webpack.optimize.DedupePlugin(),

    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      comments: false,
      compress: {
        warnings: false, // ...but do not show warnings in the console (there is a lot of them)
      },
    }),
  ],

  modulesDirectories: ['es6_basic', 'node_modules'],
  extensions: [
    '',
    '.js',
  ],

  target: 'web',
  stats: {
    assets: true,
    colors: true,
    version: false,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
  },
};

