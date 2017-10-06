import React from 'react';
import { object, string, number, func } from 'prop-types';

import Child from './Child';
import pageControls from './pageControls';
import { fontSize } from './params';
import DraggableContainer from './DraggableContainer';
import ButtonGroup from './ButtonGroup';

const enhancer = pageControls();

const NodePage = ({ page, direction, color, position, drag }) => {
	const children = page.children === null ? [] : page.children;
	return (
		<g>
			{children.map((child, i) => (
				<Child
					key={`child-${child._id_}-${i}`}
					child={child}
					direction={direction}
					color={color}
					i={i}
					size={page.children.length}
					position={position}
				/>
			))}
			<DraggableContainer onDrag={drag}>
				<text
					x={position.x}
					y={position.y - fontSize / 2}
					fontSize={fontSize}
					fill="black"
					textAnchor="middle"
					dominantBaseline="baseline"
				>
					{page._id_}
				</text>
				<ButtonGroup position={position} page={page} />
			</DraggableContainer>
		</g>
	);
};

NodePage.propTypes = {
	page: object.isRequired,
	direction: number.isRequired,
	position: object.isRequired,
	color: string.isRequired,
	drag: func.isRequired
};

export default enhancer(NodePage);
