import React from 'react';
import { func, array } from 'prop-types';
import { Field, FieldArray, reduxForm } from 'redux-form';

import SchemaFields from './SchemaFields';
import { Form, Label, FieldContainer, ActionContainer } from '../common/Form';
import { Button } from '../common/Button';

const enhancer = reduxForm({
	form: 'SchemaComponent',
	enableReinitialize: true
});

const SchemaForm = ({ collections, handleSubmit }) => {
	return (
		<Form onSubmit={handleSubmit}>
			<FieldContainer>
				<Label htmlFor="__name__">ID</Label>
				<Field name="__name__" component="input" type="text" />
			</FieldContainer>
			<FieldArray name="__fields__" component={SchemaFields} props={{ collections }} />
			<ActionContainer>
				<Button icon="check" type="submit" size="big" />
			</ActionContainer>
		</Form>
	);
};

SchemaForm.propTypes = {
	collections: array.isRequired,
	handleSubmit: func.isRequired
};

export default enhancer(SchemaForm);
