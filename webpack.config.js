const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'src/client', 'index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js',
    // clean: true,
  },
  resolve: {
    modules: [path.join(__dirname, 'src'), 'node_modules'],
    alias: {
      react: path.join(__dirname, 'node_modules', 'react'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          // "style-loader", // Создает на странице узел `style` из JS strings
          'css-loader', // Translates CSS into CommonJS
          'sass-loader', // Compiles Sass to CSS
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
          // {
          //   loader: 'image-webpack-loader',
          //   options: {
          //     mozjpeg: {
          //       progressive: true,
          //     },
          //   }
          // },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: path.resolve(__dirname, 'src/client', 'index.html'),
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
  ],
};
