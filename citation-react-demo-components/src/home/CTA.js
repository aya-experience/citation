import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

import './HomePlus.css';

const CTA = ({ cta }) => {
	return (
		<div className="CTA">
			<Link to={`${cta.target}`}>
				{cta.title}
			</Link>
		</div>
	);
};

CTA.propTypes = {
	cta: PropTypes.object.isRequired
};

export default CTA;
