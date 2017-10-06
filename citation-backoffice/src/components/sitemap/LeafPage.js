import React from 'react';
import { object, number, func } from 'prop-types';

import pageControls from './pageControls';
import { blockHeight, fontSize } from './params';
import DraggableContainer from './DraggableContainer';
import ButtonGroup from './ButtonGroup';

const enhancer = pageControls();

const LeafPage = ({ page, direction, position, drag }) => (
	<g>
		<DraggableContainer onDrag={drag}>
			<text
				x={position.x + direction * fontSize / 2}
				y={position.y - fontSize / 4}
				fontSize={fontSize}
				fill="black"
				textAnchor={direction > 0 ? 'start' : 'end'}
				dominantBaseline="central"
			>
				{page._id_}
			</text>
			<ButtonGroup
				position={{
					x: position.x + direction * blockHeight * 2,
					y: position.y
				}}
				page={page}
			/>
		</DraggableContainer>
	</g>
);

LeafPage.propTypes = {
	page: object.isRequired,
	direction: number.isRequired,
	position: object.isRequired,
	drag: func.isRequired
};

export default enhancer(LeafPage);
