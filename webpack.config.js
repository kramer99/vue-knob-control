const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

var config = {
  output: {
    path: path.resolve(__dirname + '/dist/'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.css$/,
        loader: 'style!less!css'
      }
    ]
  }
};


module.exports = [
  merge(config, {
    entry: path.resolve(__dirname + '/src/plugin.js'),
    output: {
      filename: 'vue-knob-control.min.js',
      libraryTarget: 'window',
      library: 'VueKnobControl',
    },
    plugins: [
      new UglifyJsPlugin()
    ]
  }),
  merge(config, {
    entry: path.resolve(__dirname + '/src/KnobControl.vue'),
    output: {
      filename: 'vue-knob-control.js',
      libraryTarget: 'umd',
      library: 'vue-knob-control',
      umdNamedDefine: true
    },
    plugins: [
      new UglifyJsPlugin()
    ]  
  })
];