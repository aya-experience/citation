import React from 'react';
import { object, number, func } from 'prop-types';
import { DraggableCore } from 'react-draggable';

import AddButton from './AddButton';
import pageControls from './pageControls';
import { fontSize } from './params';
import { DraggableGroup } from '../common/Draggable';

const enhancer = pageControls();

const LeafPage = ({ page, direction, position, drag, add }) =>
	<g>
		<DraggableCore onDrag={drag}>
			<DraggableGroup>
				<text
					x={position.x + direction * 0.4}
					y={position.y}
					fontSize={fontSize}
					fill="black"
					textAnchor={direction > 0 ? 'start' : 'end'}
					alignmentBaseline="central"
				>
					{page.__id__}
				</text>
				<AddButton
					position={{
						x: position.x,
						y: position.y
					}}
					onClick={add}
				/>
			</DraggableGroup>
		</DraggableCore>
	</g>;

LeafPage.propTypes = {
	page: object.isRequired,
	direction: number.isRequired,
	position: object.isRequired,
	drag: func.isRequired,
	add: func.isRequired
};

export default enhancer(LeafPage);
