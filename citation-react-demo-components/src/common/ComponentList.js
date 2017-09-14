import React from 'react';
import { node } from 'prop-types';

const ComponentList = ({ children }) => <div>{children}</div>;

ComponentList.propTypes = {
	children: node.isRequired
};

export default ComponentList;
