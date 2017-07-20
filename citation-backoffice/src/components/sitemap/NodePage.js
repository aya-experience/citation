import React from 'react';
import { object, string, number, func } from 'prop-types';
import { DraggableCore } from 'react-draggable';

import Child from './Child';
import AddButton from './AddButton';
import EditButton from './EditButton';
import pageControls from './pageControls';
import { blockHeight, fontSize } from './params';

const enhancer = pageControls();

const NodePage = ({ page, direction, color, position, drag, add }) => {
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
				<g className="Draggable">
					<text
						x={position.x}
						y={position.y - 0.5}
						fontSize={fontSize}
						fill="black"
						textAnchor="middle"
						alignmentBaseline="baseline"
					>
						{page.__id__}
					</text>
					<AddButton
						position={{
							x: position.x - blockHeight / 2,
							y: position.y + 0.5
						}}
						onClick={add}
					/>
					<EditButton
						page={page}
						position={{
							x: position.x + blockHeight / 2,
							y: position.y + 0.5
						}}
					/>
				</g>
			</DraggableCore>
		</g>
	);
};

NodePage.propTypes = {
	page: object.isRequired,
	direction: number.isRequired,
	position: object.isRequired,
	color: string.isRequired,
	drag: func.isRequired,
	add: func.isRequired
};

export default enhancer(NodePage);
