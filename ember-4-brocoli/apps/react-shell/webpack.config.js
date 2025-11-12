const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
require('dotenv').config();

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  context: __dirname,
  entry: './src/main.tsx',
  mode: isDevelopment ? 'development' : 'production',
  devServer: {
    port: process.env.PORT || 3000,
    hot: true,
    historyApiFallback: true,
    headers: isDevelopment
      ? {
          'Access-Control-Allow-Origin': '*',
        }
      : {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
        },
  },
  output: {
    publicPath: '/',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        include: [path.resolve(__dirname, 'src'), path.resolve(__dirname, '../../packages')],
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [
          isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              import: false, // Let PostCSS handle @import
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      // Inject env vars if provided (for dev with different ports)
      // Production will use runtime defaults (relative URLs / window.location.origin)
      'process.env.EMBER_APP_URL': JSON.stringify(process.env.EMBER_APP_URL || undefined),
      'process.env.ALLOWED_IFRAME_ORIGIN': JSON.stringify(process.env.ALLOWED_IFRAME_ORIGIN || undefined),
      'process.env.API_URL': JSON.stringify(process.env.API_URL || undefined),
    }),
    new ModuleFederationPlugin({
      name: 'shell',
      dts: false,
      remotes: {
        // Dynamic remotes based on environment
        // Dev: absolute URLs with ports (e.g., http://localhost:3001/remoteEntry.js)
        // Prod: relative URLs (e.g., /mf-profile/remoteEntry.js)
        profile: process.env.PROFILE_REMOTE_URL
          ? `profile@${process.env.PROFILE_REMOTE_URL}`
          : 'profile@/mf-profile/remoteEntry.js',
        blogArticle: process.env.BLOG_ARTICLE_REMOTE_URL
          ? `blogArticle@${process.env.BLOG_ARTICLE_REMOTE_URL}`
          : 'blogArticle@/mf-blog/remoteEntry.js',
      },
      shared: {
        react: {
          singleton: true,
          eager: true,
          requiredVersion: '^19.1.1',
        },
        'react-dom': {
          singleton: true,
          eager: true,
          requiredVersion: '^19.1.1',
        },
        'react-router': {
          singleton: true,
          eager: true,
          requiredVersion: '^7.1.3',
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    ...(!isDevelopment
      ? [
          new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
          }),
        ]
      : []),
  ],
};
