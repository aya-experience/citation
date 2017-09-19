/* eslint-disable import/no-dynamic-require */

import _ from 'lodash';

export default function requireComponents(componentsPathsSource) {
	const componentsPaths = _.isArray(componentsPathsSource)
		? componentsPathsSource
		: [componentsPathsSource];

	return Object.assign(
		{},
		...componentsPaths.map(componentsPath => {
			let components = require(componentsPath);
			// Handle ES2015 default export
			if (components.default) {
				components = components.default;
			}
			return components;
		})
	);
}
