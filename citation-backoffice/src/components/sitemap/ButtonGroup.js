import React from 'react';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { compose, withHandlers } from 'recompose';
import { addPage } from '../../logic/sitemap';

import { ButtonSvg } from '../common/Button';
import { blockHeight } from './params';

const enhancer = compose(
	connect(null, (dispatch, { page }) => ({
		add: () => dispatch(addPage(page))
	})),
	withRouter,
	withHandlers({
		edit: ({ history, page }) => () => history.push(`/structure/metadata/${page._id_}`),
		compose: ({ history, page }) => () => history.push(`/structure/compose/${page._id_}`)
	})
);

const ButtonGroup = ({ position, add, edit, compose }) => (
	<g>
		<rect
			x={position.x - blockHeight * 2}
			y={position.y - blockHeight}
			width={blockHeight * 4}
			height={blockHeight * 2}
			fill="transparent"
		/>
		<ButtonSvg
			position={{
				x: position.x - blockHeight - 0.2,
				y: position.y + blockHeight * 0.8
			}}
			size={blockHeight}
			icon="plus"
			onClick={add}
		/>
		<ButtonSvg
			position={{
				x: position.x,
				y: position.y + blockHeight * 0.8
			}}
			size={blockHeight}
			icon="props"
			onClick={edit}
		/>
		<ButtonSvg
			position={{
				x: position.x + blockHeight + 0.2,
				y: position.y + blockHeight * 0.8
			}}
			size={blockHeight}
			icon="edit"
			onClick={compose}
		/>
	</g>
);

ButtonGroup.propTypes = {
	position: object.isRequired,
	add: func.isRequired,
	edit: func.isRequired,
	compose: func.isRequired
};

export default enhancer(ButtonGroup);
