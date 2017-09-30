import { values } from 'lodash';
import React from 'react';
import { func, object, string } from 'prop-types';
import { Field, FieldArray, reduxForm } from 'redux-form';

import { Form, FieldContainer, Label, ActionContainer } from '../common/Form';
import { Button, ButtonLink } from '../common/Button';
import LinkField from './LinkField';
import LinksField from './LinksField';
import KeyValueField from './KeyValueField';
import { red } from '../style/colors';
import { testFieldName } from '../../utils/filters';

const enhancer = reduxForm({
	form: 'GenericObject',
	enableReinitialize: true
});

const getCustomFieldsComponents = (fields, collections) => {
	if (fields) {
		return values(fields)
			.filter(testFieldName)
			.map(field => {
				if (field.kind === 'OBJECT') {
					if (field.typeName === '*') {
						return <Field name={field.name} component={LinkField} props={{ collections }} />;
					}
					return (
						<Field
							name={field.name}
							component={LinkField}
							props={{ collections, type: field.typeName }}
						/>
					);
				} else if (field.kind === 'LIST') {
					if (field.ofType === 'KeyValuePair') {
						return (
							<FieldArray name={field.name} component={KeyValueField} props={{ collections }} />
						);
					} else if (field.typeName === '*') {
						return <FieldArray name={field.name} component={LinksField} props={{ collections }} />;
					}
					return (
						<FieldArray
							name={field.name}
							component={LinksField}
							props={{ collections, type: field.typeName }}
						/>
					);
				} else if (fields[field.name].typeName === 'JSON') {
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

const ObjectForm = ({ type, fields, collections, handleSubmit, onDelete }) => (
	<Form onSubmit={handleSubmit}>
		<FieldContainer>
			<Label htmlFor="__id__">ID</Label>
			<Field name="__id__" component="input" type="text" />
		</FieldContainer>
		{getCustomFieldsComponents(fields, collections)}
		<ActionContainer>
			<ButtonLink icon="left" to={`/content/type/${type}`} size="big" />
			<Button icon="delete" onClick={onDelete} size="big" color={red} />
			<Button icon="check" type="submit" size="big" />
		</ActionContainer>
	</Form>
);

ObjectForm.propTypes = {
	handleSubmit: func.isRequired,
	onDelete: func.isRequired,
	collections: object.isRequired,
	fields: object.isRequired,
	type: string.isRequired
};

export default enhancer(ObjectForm);
