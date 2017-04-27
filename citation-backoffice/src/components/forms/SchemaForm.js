import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';
import FieldType from './FieldType';

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
				const content = Object.keys(this.props.fields[key]).filter(field => !/^__/.test(field)).map((field, i) => {
					const entry = this.props.fields[key][field];
					const inputName = `${key}.${field}.name`;
					const kindName = `${key}.${field}.kind`;
					const typeName = `${key}.${field}.typeName`;
					console.log(entry.kind);
					return (
						<div key={i}>
							<Field component="input" type="text" name={inputName}/>
							<Field name={kindName} component={FieldType} props={{kindName, typeName, collections: this.props.schema}}/>
						</div>
					);
				});
				return <div key={key}>{title} {content} </div>;
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
