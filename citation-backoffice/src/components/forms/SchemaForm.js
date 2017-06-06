import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { FieldArray, reduxForm } from 'redux-form';
import SchemaTypes from './SchemaTypes';

import './SchemaForm.css';

class SchemaForm extends Component {
	static propTypes = {
		handleSubmit: PropTypes.func.isRequired,
		fields: PropTypes.object.isRequired,
		schema: PropTypes.array.isRequired
	};

	render() {
		console.log('render form', this.props);
		let result;
		if (this.props.fields) {
			result = <FieldArray name="data" component={SchemaTypes} props={{ schema: this.props.schema }} />;
		}
		return (
			<form className="SchemaForm" onSubmit={this.props.handleSubmit}>
				<div>
					{result}
				</div>
				<button type="submit">Submit</button>
			</form>
		);
	}
}

export default reduxForm({
	form: 'SchemaComponent',
	enableReinitialize: true
})(SchemaForm);
