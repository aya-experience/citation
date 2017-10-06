import { get, map, values } from 'lodash';
import React from 'react';
import { object, string } from 'prop-types';
import { Field } from 'redux-form';

import { InputLine } from '../common/Form';

const LinkField = ({ type, input, types }) => {
	const options = values(get(types, type ? type : input.value._type_, {}));
	return (
		<InputLine>
			{!type && (
				<Field name={`${input.name}._type_`} component="select">
					{map(types, (_, type) => (
						<option key={type} value={type}>
							{type}
						</option>
					))}
				</Field>
			)}
			<Field name={`${input.name}._id_`} component="select">
				{options.map(({ _id_ }) => (
					<option key={_id_} value={_id_}>
						{_id_}
					</option>
				))}
			</Field>
		</InputLine>
	);
};

LinkField.propTypes = {
	input: object.isRequired,
	types: object.isRequired,
	type: string
};

export default LinkField;
