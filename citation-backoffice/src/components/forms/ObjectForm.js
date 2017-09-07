import React from 'react';
import { func, object, string } from 'prop-types';
import { Field, FieldArray, reduxForm } from 'redux-form';

import { Form, FieldContainer, Label, ActionContainer } from '../common/Form';
import { Button, ButtonLink } from '../common/Button';
import LinkField from './LinkField';
import LinksField from './LinksField';
import KeyValueField from './KeyValueField';
import { red } from '../style/colors';

const enhancer = reduxForm({
	form: 'GenericObject',
	enableReinitialize: true
});

const getCustomFieldsComponents = (fields, collections) => {
	if (fields) {
		return Object.keys(fields).map(field => {
			let fieldComponent = <Field name={field} component="input" type="text" />;
			if (fields[field].kind === 'OBJECT') {
				if (fields[field].typeName === '*') {
					fieldComponent = <Field name={field} component={LinkField} props={{ collections }} />;
				}
				fieldComponent = (
					<Field name={field} component={LinkField} props={{ collections, type: fields[field].typeName }} />
				);
			} else if (fields[field].kind === 'LIST') {
				if (fields[field].ofType === 'KeyValuePair') {
					fieldComponent = <FieldArray name={field} component={KeyValueField} props={{ collections }} />;
				}
				if (fields[field].typeName === '*') {
					fieldComponent = <FieldArray name={field} component={LinksField} props={{ collections }} />;
				}
				fieldComponent = (
					<FieldArray name={field} component={LinksField} props={{ collections, type: fields[field].typeName }} />
				);
			}
			if (fields[field].typeName === 'JSON') {
				const format = value => JSON.stringify(value, null, 2);
				const parse = value => JSON.parse(value);
				fieldComponent = <Field name={field} component="textarea" format={format} parse={parse} />;
			} else if (fields[field].typeName === 'RichText') {
				fieldComponent = <Field name={field} component="textarea" />;
			}
			return (
				<FieldContainer key={field}>
					<Label htmlFor={field}>
						{field}
					</Label>
					{fieldComponent}
				</FieldContainer>
			);
		});
	}
	return null;
};

const ObjectForm = ({ type, fields, collections, onSubmit, onDelete }) =>
	<Form onSubmit={onSubmit}>
		<FieldContainer>
			<Label htmlFor="__id__">ID</Label>
			<Field name="__id__" component="input" type="text" />
		</FieldContainer>
		{getCustomFieldsComponents(fields[type], collections)}
		<ActionContainer>
			<ButtonLink icon="left" to={`/content/type/${type}`} size="big" />
			<Button icon="delete" onClick={onDelete} size="big" color={red} />
			<Button icon="check" type="submit" size="big" />
		</ActionContainer>
	</Form>;

ObjectForm.propTypes = {
	onSubmit: func.isRequired,
	onDelete: func.isRequired,
	collections: object.isRequired,
	fields: object.isRequired,
	type: string.isRequired
};

export default enhancer(ObjectForm);
