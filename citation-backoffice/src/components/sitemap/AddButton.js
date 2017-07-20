import React from 'react';
import { object, func } from 'prop-types';

import { blockHeight } from './params';

const AddButton = ({ position, onClick }) =>
	<g className="AddButton" onClick={onClick}>
		<circle
			cx={position.x}
			cy={position.y}
			r={blockHeight / 2}
			fill="rgb(180, 180, 180)"
			stroke="white"
			strokeWidth=".2"
		/>
		<line
			x1={position.x}
			y1={position.y - blockHeight / 3}
			x2={position.x}
			y2={position.y + blockHeight / 3}
			stroke="white"
			strokeWidth=".2"
		/>
		<line
			x1={position.x - blockHeight / 3}
			y1={position.y}
			x2={position.x + blockHeight / 3}
			y2={position.y}
			stroke="white"
			strokeWidth=".2"
		/>
	</g>;

AddButton.propTypes = {
	position: object.isRequired,
	onClick: func
};

export default AddButton;
