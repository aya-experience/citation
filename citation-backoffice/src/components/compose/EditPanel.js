import React from 'react';
import { object, func } from 'prop-types';
import { compose, withHandlers } from 'recompose';
import { connect } from 'react-redux';

import { editComponent, editComponentSave } from '../../logic/compose';
import form2data from '../forms/form2data';
import ComponentForm from './ComponentForm';
import { askReload } from './iframe-comunication';

const enhancer = compose(
	connect(
		state => ({ fields: state.fields }),
		dispatch => ({
			close: () => dispatch(editComponent({ component: null, position: null })),
			save: (oldId, data) => dispatch(editComponentSave(oldId, data))
		})
	),
	withHandlers({
		submit: ({ close, save, edition, fields }) => data => {
			close();
			save(edition.component.__id__, form2data(data, fields.Component)).then(askReload);
		}
	})
);

const EditPanel = ({ edition, close, submit }) =>
	<div
		className="EditPanel"
		style={{
			top: `calc(${edition.position.y}px - 5rem + 8rem)`,
			left: `calc(50% - 15rem + 6rem)`,
			width: '30rem',
			height: '20rem'
		}}
	>
		<a className="close" onClick={close}>X</a>
		<h1>Component form</h1>
		<ComponentForm onSubmit={submit} />
	</div>;

EditPanel.propTypes = {
	edition: object.isRequired,
	close: func.isRequired,
	submit: func.isRequired
};

export default enhancer(EditPanel);
