const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
  	app: './src/index.js',
  },

  plugins: [
  	new CleanWebpackPlugin(),
  	new HtmlWebpackPlugin({ template: './src/index.html' }),
  ],

  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
		rules: [
			{// CSS
				test: /\.css$/i,
				use: ['style-loader','css-loader'],
			},
			{// Javascript / BABEL
				test: /\.m?js$/i,
				exclude: /(node_modules|bower_components)/,
				use:
				{
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					},
				},
			},
			{// HTML
				test: /\.html$/i,
				loader: 'html-loader',
			},
			{// Images
				test: /\.(png|jpe?g|gif)$/i,
				loader: 'file-loader',
				options: {
          outputpath: 'images',
        },
			},
		],
	},

  optimization: {
		moduleIds: 'hashed',
		runtimeChunk: 'single',
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendors',
					chunks: 'all',
				},
			},
		},
	},
};