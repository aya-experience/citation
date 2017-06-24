import React from 'react';
import { object, number, func } from 'prop-types';
import { DraggableCore } from 'react-draggable';

import withDrag from './withDrag';
import { fontSize } from './params';

const enhancer = withDrag();

const LeafPage = ({ page, direction, position, drag }) => {
	return (
		<g>
			<DraggableCore onDrag={drag}>
				<text
					className="Draggable"
					x={position.x + direction * 0.4}
					y={position.y}
					fontSize={fontSize}
					fill="black"
					textAnchor={direction > 0 ? 'start' : 'end'}
					alignmentBaseline="central"
				>
					{page.__id__}
				</text>
			</DraggableCore>
		</g>
	);
};

LeafPage.propTypes = {
	page: object.isRequired,
	direction: number.isRequired,
	position: object.isRequired,
	drag: func.isRequired
};

export default enhancer(LeafPage);
