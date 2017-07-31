import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';

class FieldType extends Component {
	static propTypes = {
		input: PropTypes.object.isRequired,
		typeName: PropTypes.object.isRequired,
		kindName: PropTypes.object.isRequired,
		collections: PropTypes.array.isRequired
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
