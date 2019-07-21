const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const conf = {
	entry: {
		app: './src/index.js'
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist',
	},
	devServer: {
		overlay: true,
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: '/node_modules/',
			},
			{
				test: /\.(sa|sc|c)ss$/,
				use: [
					'style-loader',
					{
						loader: MiniCssExtractPlugin.loader,
					},
					'css-loader',
					'postcss-loader',
					'sass-loader',
				],
			},
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].css',
		}),
	]
};

module.exports = (env, options) => {
	const production = options.mode === 'production';
	conf.devtool = production
		? false
		: 'eval-sourcemap';
	return conf;
};
