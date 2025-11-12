const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('@module-federation/enhanced/webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  context: __dirname,
  entry: './src/main.tsx',
  mode: isDevelopment ? 'development' : 'production',
  devServer: {
    port: 3001,
    hot: true,
    headers: isDevelopment
      ? {
          'Access-Control-Allow-Origin': '*',
        }
      : {
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || 'http://localhost:3000',
        },
  },
  output: {
    // Dev: auto (uses dev server's root)
    // Prod: /mf-profile/ (nginx path)
    publicPath: isDevelopment ? 'auto' : '/mf-profile/',
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
    new ModuleFederationPlugin({
      name: 'profile',
      filename: 'remoteEntry.js',
      dts: false,
      exposes: {
        './App': './src/App.tsx',
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
