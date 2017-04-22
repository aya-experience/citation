import React, {PropTypes} from 'react';

const PageOrComponent = ({childPage, children}) => {
	const exact = childPage ? childPage.props.match.isExact : false;
	return (
		<div>{exact ? children : childPage}</div>
	);
};

PageOrComponent.propTypes = {
	childPage: PropTypes.object,
	children: PropTypes.array.isRequired
};

export default PageOrComponent;
