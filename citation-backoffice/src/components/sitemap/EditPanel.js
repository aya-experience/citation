import React from 'react';
import { object, func } from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { editPage, editPageCommit } from '../../logic/sitemap';
import PageForm from './PageForm';

const enhancer = compose(
	connect(null, dispatch => ({
		close: () => dispatch(editPage({ page: null, position: null })),
		save: (oldPage, page) => dispatch(editPageCommit({ oldPage, page }))
	})),
	withHandlers({
		submit: ({ close, save, edition }) => data => {
			close();
			save(edition.page, data);
		}
	})
);

const EditPanel = ({ edition, close, submit }) =>
	<div
		className="EditPanel"
		style={{
			top: `calc(${edition.position.y}% - 5rem)`,
			left: `calc(${edition.position.x}% - 5rem)`,
			width: '10rem',
			height: '10rem'
		}}
	>
		<a className="close" onClick={close}>X</a>
		<h1>Page form</h1>
		<PageForm onSubmit={submit} />
	</div>;

EditPanel.propTypes = {
	edition: object.isRequired,
	close: func.isRequired,
	submit: func.isRequired
};

export default enhancer(EditPanel);
