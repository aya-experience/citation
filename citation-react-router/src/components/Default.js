import React from 'react';
import { node, object } from 'prop-types';

const Default = ({ props, children }) =>
	<div className="Default">
		Default component with data {JSON.stringify(props)}
		{children}
	</div>;

Default.propTypes = {
	children: node,
	props: object
};

export default Default;
