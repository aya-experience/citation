import React from 'react';
import { func, object } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, FieldArray, reduxForm } from 'redux-form';

import { Form, FieldContainer, Label, ActionContainer } from '../common/Form';
import { Button, ButtonLink } from '../common/Button';
import KeyValueField from '../forms/KeyValueField';

const enhancer = compose(
	connect(state => ({
		types: state.content
	})),
	reduxForm({ form: 'page' })
);

const ComponentForm = ({ page, handleSubmit, types }) => (
	<Form onSubmit={handleSubmit}>
		<FieldContainer>
			<Label htmlFor="_id_">Id</Label>
			<Field name="_id_" component="input" type="text" />
		</FieldContainer>
		<FieldContainer>
			<Label htmlFor="type">Type</Label>
			<Field name="type" component="input" type="text" />
		</FieldContainer>
		<FieldContainer>
			<Label htmlFor="props">Props</Label>
			<FieldArray name="props" component={KeyValueField} props={{ types }} />
		</FieldContainer>
		<ActionContainer>
			<ButtonLink icon="left" to={`/structure/compose/${page._id_}`} size="big" />
			<Button icon="check" type="submit" size="big" />
		</ActionContainer>
	</Form>
);

ComponentForm.propTypes = {
	page: object.isRequired,
	handleSubmit: func.isRequired,
	types: object.isRequired
};

export default enhancer(ComponentForm);
