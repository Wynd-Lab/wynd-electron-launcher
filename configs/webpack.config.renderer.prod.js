/**
 * Build config for electron renderer process
 */

const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const { merge } = require('webpack-merge')
const TerserPlugin = require('terser-webpack-plugin')
const baseConfig = require('./webpack.config.base')

const prodConfig = merge(baseConfig, {
	devtool: 'source-map',

	mode: 'production',

	target: 'electron-renderer',

	entry: {
    pos: './src/pos/index.tsx',
    loader: './src/loader/index.tsx'
  },

	output: {
		path: path.join(__dirname, '../dist'),
		filename: '[name].js',
	},

	optimization: {
		minimize: true,
		minimizer:
			[
				new TerserPlugin({
					parallel: true,
				}),
				new CssMinimizerPlugin(),
			],
	},

	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: 'production',
			DEBUG_PROD: false,
		}),

		new MiniCssExtractPlugin({
			filename: "[name].css",
		}),

		new BundleAnalyzerPlugin({
			analyzerMode:
				process.env.OPEN_ANALYZER === 'true' ? 'server' : 'disabled',
			openAnalyzer: process.env.OPEN_ANALYZER === 'true',
		}),
	],
});
prodConfig.module.rules[0].use.unshift({
	loader: MiniCssExtractPlugin.loader,
	options: {
		publicPath: '/css',
	},
})

module.exports = prodConfig
