import React from 'react';
import { object } from 'prop-types';
import { Link } from 'react-router-dom';

const CTA = ({ cta }) => {
	return (
		<div>
			<Link to={`${cta.target}`}>{cta.title}</Link>
		</div>
	);
};

CTA.propTypes = {
	cta: object.isRequired
};

export default CTA;
