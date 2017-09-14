import React from 'react';
import { object, array, string } from 'prop-types';
import { Field } from 'redux-form';

const FieldType = ({ input, kindName, typeName, collections }) => {
	const kind = input.value;
	const scalarTypes = ['String', 'RichText', 'Image', 'JSON'];
	return (
		<div>
			<Field name={kindName} component="select">
				<option key="TEXT" value="String">
					Text
				</option>
				<option key="RICHTEXT" value="RichText">
					Rich Text
				</option>
				<option key="IMAGE" value="Image">
					Image
				</option>
				<option key="JSON" value="JSON">
					Json
				</option>
				<option key="OBJECT" value="OBJECT">
					Object
				</option>
				<option key="LIST" value="LIST">
					Objects List
				</option>
			</Field>
			{!scalarTypes.includes(kind) && (
				<Field name={typeName} component="select">
					{collections.map((field, i) => (
						<option key={i} value={field}>
							{field}
						</option>
					))}
				</Field>
			)}
		</div>
	);
};

FieldType.propTypes = {
	input: object.isRequired,
	typeName: string.isRequired,
	kindName: string.isRequired,
	collections: array.isRequired
};

export default FieldType;
