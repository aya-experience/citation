import React from 'react';
import { func, node } from 'prop-types';
import styled from 'styled-components';
import { DraggableCore } from 'react-draggable';
import { ButtonSvgContainer } from '../common/Button';

export const DraggableGroup = styled.g`
	cursor: move;

	${ButtonSvgContainer} {
		display: none;
		opacity: 0;
		transition: .5s opacity ease;
	}

	&:hover ${ButtonSvgContainer} {
		display: block;
		opacity: 1;
	}
`;

const DraggableContainer = ({ onDrag, children }) =>
	<DraggableCore onDrag={onDrag}>
		<DraggableGroup>
			{children}
		</DraggableGroup>
	</DraggableCore>;

DraggableContainer.propTypes = {
	onDrag: func.isRequired,
	children: node.isRequired
};

export default DraggableContainer;
