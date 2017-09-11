import React from 'react';
import { object, func } from 'prop-types';

import Child from './Child';
import pageControls from './pageControls';
import { blockHeight, blockWidth, fontSize, colors } from './params';
import DraggableContainer from './DraggableContainer';
import { darkBlue } from '../style/colors';
import ButtonGroup from './ButtonGroup';

const enhancer = pageControls();

const RootPage = ({ page, position, drag }) => {
	const children = page.children === null ? [] : page.children;
	return (
		<g>
			{children.map((child, i) =>
				<Child
					key={`child-${child.__id__}-${i}`}
					child={child}
					direction={0}
					color={colors[i % colors.length]}
					i={i}
					size={page.children.length}
					position={position}
				/>
			)}
			<DraggableContainer onDrag={drag}>
				<rect
					x={position.x - blockWidth / 2}
					y={position.y - blockHeight / 2}
					width={blockWidth}
					height={blockHeight}
					rx="0.5"
					ry="0.5"
					fill={darkBlue}
				/>
				<text
					x={position.x}
					y={position.y - fontSize / 4}
					fontSize={fontSize}
					fill="white"
					textAnchor="middle"
					alignmentBaseline="central"
				>
					{page.__id__}
				</text>
				<ButtonGroup position={position} page={page} />
			</DraggableContainer>
		</g>
	);
};

RootPage.propTypes = {
	page: object.isRequired,
	position: object.isRequired,
	drag: func.isRequired
};

export default enhancer(RootPage);
