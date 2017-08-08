import React, { PropTypes } from 'react';

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
	children: PropTypes.array.isRequired,
	image: PropTypes.object.isRequired
};

export default Banner;
