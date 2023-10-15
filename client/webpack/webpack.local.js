const path = require('path');

const Dotenv = require('dotenv-webpack');

module.exports = {
	mode: 'development',
	devServer: {
		historyApiFallback: true,
		hot: true,
		open: true,
		port: 3300,
		proxy: {
			'/api': {
				target: 'http://localhost:3300',
				router: () => 'http://localhost:5500',
				logLevel: 'debug' /*optional*/,
			},
		},
	},
	devtool: 'cheap-module-source-map',
	plugins: [
		new Dotenv({
			path: path.resolve(__dirname, '..', './.env.development'),
		}),
	],
};
