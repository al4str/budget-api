require('dotenv').config();

const path = require('path');
const NodeExternals = require('webpack-node-externals');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NotifierPlugin = require('webpack-notifier');
const DotenvPlugin = require('dotenv-webpack');
const info = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  target: 'node',
  devtool: 'source-map',
  mode: isProduction
    ? 'production'
    : 'development',
  stats: 'minimal',
  entry: {
    'index.js': './src/index.js',
  },
  externals: [
    NodeExternals({
      modulesFromFile: true,
    }),
  ],
  output: {
    path: path.resolve(process.cwd(), 'dist'),
    filename: '[id]',
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
    extensions: ['.js'],
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...(!isProduction
      ? [
        new NotifierPlugin({
          title: info.name,
          alwaysNotify: true,
        }),
      ]
      : []),
    new DotenvPlugin(),
  ],
};
