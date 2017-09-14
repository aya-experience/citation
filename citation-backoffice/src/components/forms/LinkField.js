import { get, map } from 'lodash';
import React from 'react';
import { object, string } from 'prop-types';
import { Field } from 'redux-form';

import { InputLine } from '../common/Form';

const LinkField = ({ type, input, collections }) => {
	const values = get(collections, type ? type : input.value.__type__, []);
	return (
		<InputLine>
			{!type && (
				<Field name={`${input.name}.__type__`} component="select">
					{map(collections, (_, type) => (
						<option key={type} value={type}>
							{type}
						</option>
					))}
				</Field>
			)}
			<Field name={`${input.name}.__id__`} component="select">
				{values.map((value, i) => (
					<option key={i} value={value.__id__}>
						{value.__id__}
					</option>
				))}
			</Field>
		</InputLine>
	);
};

LinkField.propTypes = {
	input: object.isRequired,
	collections: object.isRequired,
	type: string
};

export default LinkField;
