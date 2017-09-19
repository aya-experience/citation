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
		collections: state.content
	})),
	reduxForm({ form: 'page' })
);

const ComponentForm = ({ page, handleSubmit, collections }) => (
	<Form onSubmit={handleSubmit}>
		<FieldContainer>
			<Label htmlFor="__id__">Id</Label>
			<Field name="__id__" component="input" type="text" />
		</FieldContainer>
		<FieldContainer>
			<Label htmlFor="type">Type</Label>
			<Field name="type" component="input" type="text" />
		</FieldContainer>
		<FieldContainer>
			<Label htmlFor="props">Props</Label>
			<FieldArray name="props" component={KeyValueField} props={{ collections }} />
		</FieldContainer>
		<ActionContainer>
			<ButtonLink icon="left" to={`/structure/compose/${page.__id__}`} size="big" />
			<Button icon="check" type="submit" size="big" />
		</ActionContainer>
	</Form>
);

ComponentForm.propTypes = {
	page: object.isRequired,
	handleSubmit: func.isRequired,
	collections: object.isRequired
};

export default enhancer(ComponentForm);
