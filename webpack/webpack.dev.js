const webpack = require("webpack");
const commonPaths = require("./paths");

module.exports = {
	mode: "development",
	output: {
		filename: "[name].js",
		path: commonPaths.outputPath,
		chunkFilename: "[name].js",
		publicPath: "/"
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: ['eslint-loader', 'babel-loader']
			},
			{
				test: /\.(scss|css)$/,
				use: [
					{
						loader: "style-loader" // inject CSS to page
					},
					{
						loader: "css-loader" // translates CSS into CommonJS modules
					},
					{
						loader: "postcss-loader", // Run postcss actions
						options: {
							plugins: function () {
								// postcss plugins, can be exported to postcss.config.js
								return [require("autoprefixer")];
							}
						}
					},
					{
						loader: "sass-loader" // compiles Sass to CSS
					}
				]
			},
			{
				test: /jquery-ui\/.+\.js$/,
				use: {
					loader: "imports-loader?jQuery=jquery,$=jquery,this=>window"
				}
			}
		]
	},
	devServer: {
		port: 4000,
		contentBase: commonPaths.outputPath,
		compress: true,
		historyApiFallback: true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		})
	]
};
