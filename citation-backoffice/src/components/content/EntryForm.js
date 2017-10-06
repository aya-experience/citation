import { values } from 'lodash';
import React from 'react';
import { func, object, string } from 'prop-types';
import { Field, FieldArray, reduxForm } from 'redux-form';

import { Form, FieldContainer, Label, ActionContainer } from '../common/Form';
import { Button, ButtonLink } from '../common/Button';
import LinkField from '../forms/LinkField';
import LinksField from '../forms/LinksField';
import KeyValueField from '../forms/KeyValueField';
import { red } from '../style/colors';
import { testFieldName } from '../../utils/filters';

const enhancer = reduxForm({
	form: 'Entry',
	enableReinitialize: true
});

const getCustomFieldsComponents = (fields, types) => {
	if (fields) {
		return values(fields)
			.filter(testFieldName)
			.map(field => {
				if (field.kind === 'OBJECT') {
					if (field.typeName === '*') {
						return <Field name={field.name} component={LinkField} props={{ types }} />;
					}
					return (
						<Field
							name={field.name}
							component={LinkField}
							props={{ types, type: field.typeName }}
						/>
					);
				} else if (field.kind === 'LIST') {
					if (field.ofType === 'KeyValuePair') {
						return <FieldArray name={field.name} component={KeyValueField} props={{ types }} />;
					} else if (field.typeName === '*') {
						return <FieldArray name={field.name} component={LinksField} props={{ types }} />;
					}
					return (
						<FieldArray
							name={field.name}
							component={LinksField}
							props={{ types, type: field.typeName }}
						/>
					);
				} else if (field.typeName === 'JSON') {
					const format = value => JSON.stringify(value, null, 2);
					const parse = value => JSON.parse(value);
					return <Field name={field.name} component="textarea" format={format} parse={parse} />;
				} else if (field.typeName === 'RichText') {
					return <Field name={field.name} component="textarea" />;
				}
				// eslint-disable-next-line react/jsx-key
				return <Field name={field.name} component="input" type="text" />;
			})
			.map(fieldComponent => (
				<FieldContainer key={fieldComponent.props.name}>
					<Label htmlFor={fieldComponent.props.name}>{fieldComponent.props.name}</Label>
					{fieldComponent}
				</FieldContainer>
			));
	}
	return null;
};

const EntryForm = ({ type, fields, types, handleSubmit, onDelete }) => (
	<Form onSubmit={handleSubmit}>
		<FieldContainer>
			<Label htmlFor="_id_">ID</Label>
			<Field name="_id_" component="input" type="text" />
		</FieldContainer>
		{getCustomFieldsComponents(fields, types)}
		<ActionContainer>
			<ButtonLink icon="left" to={`/content/type/${type}`} size="big" />
			<Button icon="delete" onClick={onDelete} size="big" color={red} />
			<Button icon="check" type="submit" size="big" />
		</ActionContainer>
	</Form>
);

EntryForm.propTypes = {
	handleSubmit: func.isRequired,
	onDelete: func.isRequired,
	types: object.isRequired,
	fields: object.isRequired,
	type: string.isRequired
};

export default enhancer(EntryForm);
