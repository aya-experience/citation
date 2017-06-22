import React from 'react';
import { array } from 'prop-types';

const Default = ({ data, children }) =>
	<div className="Default">
		Default component with data {JSON.stringify(data)}
		{children}
	</div>;

Default.propTypes = {
	children: array,
	data: array
};

export default Default;
