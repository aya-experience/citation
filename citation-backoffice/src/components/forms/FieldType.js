import React, { Component } from 'react';
import { object, array } from 'prop-types';
import { Field } from 'redux-form';

class FieldType extends Component {
	static propTypes = {
		input: object.isRequired,
		typeName: object.isRequired,
		kindName: object.isRequired,
		collections: array.isRequired
	};

	render() {
		const kind = this.props.input.value;
		const scalarTypes = ['String', 'RichText', 'Image', 'JSON'];
		return (
			<div>
				<Field name={this.props.kindName} component="select">
					<option key="TEXT" value="String">Text</option>
					<option key="RICHTEXT" value="RichText">Rich Text</option>
					<option key="IMAGE" value="Image">Image</option>
					<option key="JSON" value="JSON">Json</option>
					<option key="OBJECT" value="OBJECT">Object</option>
					<option key="LIST" value="LIST">Objects List</option>
				</Field>
				{!scalarTypes.includes(kind) &&
					<Field name={this.props.typeName} component="select">
						{this.props.collections.map((field, i) => <option key={i} value={field}>{field}</option>)}
					</Field>}
			</div>
		);
	}
}

export default FieldType;
