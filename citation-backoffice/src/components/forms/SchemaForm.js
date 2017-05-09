import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {FieldArray, reduxForm} from 'redux-form';
import Fields from './Fields';

import './SchemaForm.css';

class SchemaForm extends Component {
	static propTypes = {
		handleSubmit: PropTypes.func.isRequired,
		fields: PropTypes.object.isRequired,
		schema: PropTypes.array.isRequired
	}

	render() {
		let result = [];
		if (this.props.fields) {
			result = Object.keys(this.props.fields).filter(field => !(field === 'Schema' || field === 'Page' || field === 'Component' || field === 'Content')).map(key => {
				const title = (<h2>{key}</h2>);
				const content = <FieldArray name={key} component={Fields} props={{name: key, collections: this.props.schema}}/>;
				return (<div key={key}>
					{title} {content}
				</div>);
			});
		}
		return (
			<form className="SchemaForm" onSubmit={this.props.handleSubmit}>
				{
					result
				}
				<button type="submit">Submit</button>
			</form>
		);
	}
}

export default reduxForm({
	form: 'SchemaComponent',
	enableReinitialize: true
})(SchemaForm);
