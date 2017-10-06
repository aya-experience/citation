import React from 'react';
import { object, func } from 'prop-types';
import { Field } from 'redux-form';
import { withHandlers, compose } from 'recompose';

import ValueOrListField from './ValueOrListField';
import { FieldArrayContainer, InputLine, ControlLine } from '../common/Form';
import { Button } from '../common/Button';
import { red } from '../style/colors';

const enhancer = compose(
	withHandlers({
		handleAdd: props => () => {
			props.fields.push({
				_key_: '',
				_value_: null,
				_list_: null
			});
		},
		handleRemove: ({ fields }) => index => () => {
			fields.remove(index);
		}
	})
);

const KeyValueField = ({ types, fields, handleAdd, handleRemove }) => (
	<FieldArrayContainer>
		{fields.map((link, i) => (
			<InputLine key={i}>
				<Field name={link} component={ValueOrListField} props={{ types }} />
				<Button icon="delete" color={red} onClick={handleRemove(i)} />
			</InputLine>
		))}
		<ControlLine>
			<Button icon="plus" onClick={handleAdd} />
		</ControlLine>
	</FieldArrayContainer>
);

KeyValueField.propTypes = {
	handleAdd: func.isRequired,
	handleRemove: func.isRequired,
	fields: object.isRequired,
	types: object.isRequired
};

export default enhancer(KeyValueField);
