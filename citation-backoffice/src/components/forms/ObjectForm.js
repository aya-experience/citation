import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import LinkField from './LinkField';
import LinksField from './LinksField';

import './ObjectForm.css';

class ObjectForm extends Component {
	static propTypes = {
		handleSubmit: PropTypes.func.isRequired,
		collections: PropTypes.object.isRequired,
		fields: PropTypes.object.isRequired
	}

	render() {
		const collections = this.props.collections;
		const fields = this.props.fields;
		let customFields = [];
		if (fields.data) {
			customFields = Object.keys(fields.data).filter(field => !field.startsWith('__')).map(field => {
				const label = (<label htmlFor={field}>{field}</label>);
				if (fields.data[field].kind === 'OBJECT') {
					if (fields.data[field].typeName === '*') {
						return (
							<div key={field}>
								{label}
								<Field name={field} component={LinkField} props={{collections}}/>
							</div>
						);
					}
					return (
						<div key={field}>
							{label}
							<Field name={field} component={LinkField} props={{collections, type: fields.data[field].typeName}}/>
						</div>
					);
				} else if (fields.data[field].kind === 'LIST') {
					if (fields.data[field].typeName === '*') {
						return (
							<div key={field}>
								{label}
								<FieldArray name={field} component={LinksField} props={{collections}}/>
							</div>
						);
					}
					return (
						<div key={field}>
							{label}
							<FieldArray name={field} component={LinksField} props={{collections, type: fields.data[field].typeName}}/>
						</div>
					);
				}
				return (
					<div key={field}>
						{label}
						<Field name={field} component="input" type="text"/>
					</div>
				);
			});
		}
		return (
			<form className="ObjectForm" onSubmit={this.props.handleSubmit}>
				<div>
					<label htmlFor="__id__">ID</label>
					<Field name="__id__" component="input" type="text"/>
				</div>
				{
					customFields
				}
				<button type="submit">Submit</button>
			</form>
		);
	}
}

export default reduxForm({
	form: 'GenericObject',
	enableReinitialize: true
})(ObjectForm);
