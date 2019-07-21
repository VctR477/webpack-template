const conf = {
	plugins: [
		require('autoprefixer')({
			browsers: [
				'last 4 versions',
				'iOS >= 8',
				'Chrome >= 26',
				'Android >= 4.1',
				'Firefox >= 20',
				'Safari >= 6.1',
				'Opera >= 12.1',
				'Explorer >= 10',
				'Edge >= 12',
			],
			flexbox: 'no-2009',
		}),
	]
}

module.exports = (options) => {
	const production = options.webpack.mode === 'production';
	if (production) {
		conf.plugins.push(
			require('cssnano')({
				// Recommend using cssnano only in safe mode
				safe: true,
				// calc is no longer necessary, as it is already done by postcss-fixes due to precision rounding reasons
				calc: false,
				svgo: true,
				reduceInitial: true,
				preset: [
					'default', {
						discardComments: {
						removeAll: true
						}
					}
				]
			})
		);
	}
	return conf;
};
