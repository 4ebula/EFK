const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPligin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const devServer = (isDev) => !isDev ? {} : {
  devServer: {
    open: true,
    hot: true,
    port: 8080,
    contentBase: path.join(__dirname, 'public'),
  }
};

const esLintPlugin = (isDev) => isDev ? [] : [ new ESLintPlugin({ extensions: ['ts', 'js'] }) ];

module.exports = ({develop}) => ({
  mode: develop ? 'development' : 'production',
  devtool: develop ? 'inline-source-map' : false,
  entry: {
    main: './src/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:ico|gif|png|jpeg|jpg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/i,
        type: 'asset/inline',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPligin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPligin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // title: "Demo webpack", //Will create html file with title "Demo webpack"
      template: './src/index.html',
    }),
    new MiniCssExtractPligin({
      // filename: '[name].[contenthash].css',
      filename: '[name].css',
    }),
    new CopyPlugin({
      patterns: [
        { from: './public' }
      ]
    }),
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    ...esLintPlugin(develop),
  ],
  output: {
    // filename: '[name].[contenthash].js',
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'assets/[name][ext]',
  },
  ...devServer(develop),
});