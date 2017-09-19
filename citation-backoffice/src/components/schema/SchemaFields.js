import React from 'react';
import { array, func, object } from 'prop-types';
import { Field } from 'redux-form';
import { withHandlers } from 'recompose';

import FieldType from '../forms/FieldType';
import { FieldArrayContainer, InputLine, ControlLine } from '../common/Form';
import { Button } from '../common/Button';

const FieldInputLine = InputLine.extend`
	margin-top: 1rem;

	&:first-of-type {
		margin-top: 0;
	}

	& > input {
		flex: 2;
	}

	& > div:first-of-type {
		flex: 3;
		display: flex;
		flex-direction: row;

		select {
			margin-left: 1rem;
		}
	}

	& > ${ControlLine} {
		width: 5rem;
		margin-top: 0;
	}
`;

const enhancer = withHandlers({
	handleAdd: ({ fields }) => () => {
		const usedNames = fields.getAll().map(field => {
			return field.name;
		});
		let index = 1;
		let name;
		do {
			name = `new${index}`;
			index++;
		} while (usedNames.indexOf(name) > -1);
		fields.push({
			name,
			typeName: 'String',
			kind: 'String'
		});
	},

	handleRemove: ({ fields }) => index => () => fields.remove(index)
});

const SchemaFields = ({ fields, collections, handleRemove, handleAdd }) => {
	return (
		<FieldArrayContainer>
			{fields.map((link, i) => {
				const inputName = `${link}.name`;
				const kindName = `${link}.kind`;
				const typeName = `${link}.typeName`;
				return (
					<FieldInputLine key={i}>
						<Field component="input" type="text" name={inputName} />
						<Field
							name={kindName}
							component={FieldType}
							props={{
								kindName,
								typeName,
								collections
							}}
						/>
						<ControlLine>
							<Button icon="delete" type="button" onClick={handleRemove(i)} />
						</ControlLine>
					</FieldInputLine>
				);
			})}
			<ControlLine>
				<Button icon="plus" onClick={handleAdd} />
			</ControlLine>
		</FieldArrayContainer>
	);
};

SchemaFields.propTypes = {
	fields: object.isRequired,
	collections: array.isRequired,
	handleRemove: func.isRequired,
	handleAdd: func.isRequired
};

export default enhancer(SchemaFields);
