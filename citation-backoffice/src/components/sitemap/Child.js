import { isEmpty } from 'lodash';
import React from 'react';
import { object, number, string } from 'prop-types';
import 'recompose';

import LeafPage from './LeafPage';
import NodePage from './NodePage';
import { blockWidth, childSpaceX, childSpaceY, linkCurv, linkWidth } from './params';

const computePositionFromRoot = (i, size, position) => {
	const halfI = Math.floor(i / 2);
	const halfSize = Math.floor(size / 2) + (i % 2 === 0 ? size % 2 : 0);
	const childrenHeight = (halfSize - 1) * childSpaceY;
	const direction = (i % 2) * -2 + 1;
	return {
		from: {
			x: position.x + direction * blockWidth / 2,
			y: position.y
		},
		to: {
			x: position.x + direction * blockWidth / 2 + direction * childSpaceX,
			y: position.y - childrenHeight / 2 + childSpaceY * halfI
		},
		direction
	};
};

const computePositionWithDirection = (direction, i, size, position) => {
	const childrenHeight = (size - 1) * childSpaceY;
	return {
		from: position,
		to: {
			x: position.x + direction * childSpaceX,
			y: position.y - childrenHeight / 2 + childSpaceY * i
		},
		direction
	};
};

const Child = ({ child, direction, color, i, size, position }) => {
	const positions =
		direction === 0
			? computePositionFromRoot(i, size, position)
			: computePositionWithDirection(direction, i, size, position);
	if (child.position) {
		positions.to = {
			x: child.position.x + positions.from.x,
			y: child.position.y + positions.from.y
		};
	}
	return (
		<g key={`child-${child._id_}-${i}`}>
			{direction === 0 ? (
				undefined
			) : (
				<circle cx={positions.from.x} cy={positions.from.y} r={linkWidth} fill="white" />
			)}
			<path
				d={`M${positions.from.x},${positions.from.y} C${positions.from.x +
					positions.direction * linkCurv},${positions.from.y} ${positions.to.x -
					positions.direction * linkCurv},${positions.to.y} ${positions.to.x},${positions.to.y}`}
				fill="transparent"
				stroke={color}
				strokeWidth={linkWidth}
				strokeLinecap="round"
			/>
			{isEmpty(child.children) ? (
				<LeafPage
					page={child}
					direction={positions.direction}
					position={positions.to}
					from={positions.from}
				/>
			) : (
				<NodePage
					page={child}
					direction={positions.direction}
					color={color}
					position={positions.to}
					from={positions.from}
				/>
			)}
		</g>
	);
};

Child.propTypes = {
	child: object.isRequired,
	direction: number.isRequired,
	color: string.isRequired,
	i: number.isRequired,
	size: number.isRequired,
	position: object.isRequired
};

export default Child;
