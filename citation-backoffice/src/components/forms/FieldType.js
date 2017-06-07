import _ from 'lodash';
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
		return (
			<div>
				<Field name={this.props.kindName} component="select">
					<option key="SCALAR" value="SCALAR">String</option>
					<option key="OBJECT" value="OBJECT">Object</option>
					<option key="LIST" value="LIST">Objects List</option>
				</Field>
				{kind !== 'SCALAR' &&
					<Field name={this.props.typeName} component="select">
						{this.props.collections.map((field, i) => <option key={i} value={field}>{field}</option>)}
					</Field>}
			</div>
		);
	}
}

export default FieldType;
