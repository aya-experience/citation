import React from 'react';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { compose, withHandlers } from 'recompose';

import { editPage } from '../../logic/sitemap';
import { blockHeight } from './params';

const width = 0.3;

const enhancer = compose(
	connect(null, (dispatch, { page, position }) => ({
		editPage: () => dispatch(editPage({ page, position }))
	})),
	withHandlers({
		edit: ({ editPage }) => () => editPage()
	})
);

const EditButton = ({ position, edit }) =>
	<g className="EditButton" onClick={edit}>
		<circle
			cx={position.x}
			cy={position.y}
			r={blockHeight / 2}
			fill="rgb(180, 180, 180)"
			stroke="white"
			strokeWidth=".2"
		/>
		<path
			d={`M${position.x + blockHeight / 4 - width},${position.y - blockHeight / 4} ${position.x -
				blockHeight / 4},${position.y + blockHeight / 4 - width} ${position.x - blockHeight / 4},${position.y +
				blockHeight / 4} ${position.x - blockHeight / 4 + width},${position.y + blockHeight / 4} ${position.x +
				blockHeight / 4},${position.y - blockHeight / 4 + width} Z`}
			fill="white"
		/>
	</g>;

EditButton.propTypes = {
	position: object.isRequired,
	edit: func.isRequired
};

export default enhancer(EditButton);
