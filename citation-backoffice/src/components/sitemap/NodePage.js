import React from 'react';
import { object, string, number, func } from 'prop-types';
import { DraggableCore } from 'react-draggable';

import Child from './Child';
import withDrag from './withDrag';
import { fontSize } from './params';

const enhancer = withDrag();

const NodePage = ({ page, direction, color, position, drag }) => {
	const children = page.children === null ? [] : page.children;
	return (
		<g>
			{children.map((child, i) =>
				<Child
					key={`child-${child.__id__}-${i}`}
					child={child}
					direction={direction}
					color={color}
					i={i}
					size={page.children.length}
					position={position}
				/>
			)}
			<DraggableCore onDrag={drag}>
				<text
					className="Draggable"
					x={position.x}
					y={position.y - 0.5}
					fontSize={fontSize}
					fill="black"
					textAnchor="middle"
					alignmentBaseline="baseline"
				>
					{page.__id__}
				</text>
			</DraggableCore>
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
