import React from 'react';
import { object, func } from 'prop-types';
import { DraggableCore } from 'react-draggable';

import Child from './Child';
import withDrag from './withDrag';
import { blockHeight, blockWidth, fontSize, colors } from './params';

const enhancer = withDrag();

const RootPage = ({ page, position, drag }) => {
	const children = page.children === null ? [] : page.children;
	return (
		<g>
			{children.map((child, i) =>
				<Child
					key={`child-${child.__id__}-${i}`}
					child={child}
					direction={0}
					color={colors[i % page.children.length]}
					i={i}
					size={page.children.length}
					position={position}
				/>
			)}
			<DraggableCore onDrag={drag}>
				<g className="Draggable">
					<rect
						x={position.x - blockWidth / 2}
						y={position.y - blockHeight / 2}
						width={blockWidth}
						height={blockHeight}
						rx="1"
						ry="1"
						fill="rgb(180, 180, 180)"
					/>
					<text
						x={position.x}
						y={position.y}
						fontSize={fontSize}
						fill="white"
						textAnchor="middle"
						alignmentBaseline="central"
					>
						{page.__id__}
					</text>
				</g>
			</DraggableCore>
		</g>
	);
};

RootPage.propTypes = {
	page: object.isRequired,
	position: object.isRequired,
	drag: func.isRequired
};

export default enhancer(RootPage);
