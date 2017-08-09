import React from 'react';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, FieldArray, reduxForm } from 'redux-form';

import KeyValueField from '../forms/KeyValueField';

const enhancer = compose(
	connect(state => ({
		initialValues: state.compose.edition.component,
		collections: state.collections
	})),
	reduxForm({ form: 'page' })
);

const ComponentForm = ({ handleSubmit, collections }) =>
	<form onSubmit={handleSubmit}>
		<div>
			<label htmlFor="__id__">Id</label>
			<Field name="__id__" component="input" type="text" />
		</div>
		<div>
			<label htmlFor="type">Type</label>
			<Field name="type" component="input" type="text" />
		</div>
		<div>
			<label htmlFor="props">Props</label>
			<FieldArray name="props" component={KeyValueField} props={{ collections }} />
		</div>
		<button>Submit</button>
	</form>;

ComponentForm.propTypes = {
	handleSubmit: func.isRequired,
	collections: object.isRequired
};

export default enhancer(ComponentForm);
