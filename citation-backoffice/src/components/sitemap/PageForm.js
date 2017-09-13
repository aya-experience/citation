import React from 'react';
import { func } from 'prop-types';
import { compose } from 'recompose';
import { Field, reduxForm } from 'redux-form';

import { Form, FieldContainer, Label, ActionContainer } from '../common/Form';
import { Button, ButtonLink } from '../common/Button';

const enhancer = compose(reduxForm({ form: 'page' }));

const PageForm = ({ handleSubmit }) =>
	<Form onSubmit={handleSubmit}>
		<FieldContainer>
			<Label htmlFor="__id__">ID</Label>
			<Field name="__id__" component="input" type="text" />
		</FieldContainer>
		<FieldContainer>
			<Label htmlFor="slug">slug</Label>
			<Field name="slug" component="input" type="text" />
		</FieldContainer>
		<FieldContainer>
			<Label htmlFor="title">title</Label>
			<Field name="title" component="input" type="text" />
		</FieldContainer>
		<ActionContainer>
			<ButtonLink icon="left" to="/structure" size="big" />
			<Button icon="check" type="submit" size="big" />
		</ActionContainer>
	</Form>;

PageForm.propTypes = {
	handleSubmit: func.isRequired
};

export default enhancer(PageForm);
