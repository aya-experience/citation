import React, {PropTypes} from 'react';

const ComponentList = ({children}) => (
	<div>{children}</div>
);

ComponentList.propTypes = {
	children: PropTypes.array.isRequired
};

export default ComponentList;
