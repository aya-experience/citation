import React from 'react';
import { object, array } from 'prop-types';

const PageOrComponent = ({ childPage, children }) => {
	const exact = childPage ? childPage.props.match.isExact : false;
	return <div>{exact ? children : childPage}</div>;
};

PageOrComponent.propTypes = {
	childPage: object,
	children: array.isRequired
};

PageOrComponent.defaultProps = {
	childPage: undefined
};

export default PageOrComponent;
