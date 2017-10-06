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

const SchemaForm = ({ types, handleSubmit }) => {
	return (
		<Form onSubmit={handleSubmit}>
			<FieldContainer>
				<Label htmlFor="_name_">ID</Label>
				<Field name="_name_" component="input" type="text" />
			</FieldContainer>
			<FieldContainer>
				<Label htmlFor="_fields_">fields</Label>
				<FieldArray name="_fields_" component={SchemaFields} props={{ types }} />
			</FieldContainer>
			<ActionContainer>
				<Button icon="check" type="submit" size="big" />
			</ActionContainer>
		</Form>
	);
};

SchemaForm.propTypes = {
	types: array.isRequired,
	handleSubmit: func.isRequired
};

export default enhancer(SchemaForm);
