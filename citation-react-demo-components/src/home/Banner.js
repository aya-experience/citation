import React from 'react';
import { array, object } from 'prop-types';

import './Banner.css';

const Banner = ({ image, children }) => {
	return (
		<div className="Banner">
			<p>
				{image.image}
			</p>
			<div className="Banner-CTA">
				{children}
			</div>
		</div>
	);
};

Banner.propTypes = {
	children: array.isRequired,
	image: object.isRequired
};

export default Banner;
