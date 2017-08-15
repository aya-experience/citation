import React, { Component } from 'react';
import { func, object, string } from 'prop-types';
import { Field, FieldArray, reduxForm } from 'redux-form';
import LinkField from './LinkField';
import LinksField from './LinksField';
import KeyValueField from './KeyValueField';

import './ObjectForm.css';

export class GenericObjectForm extends Component {
	static propTypes = {
		handleSubmit: func.isRequired,
		handleDelete: func.isRequired,
		collections: object.isRequired,
		fields: object.isRequired,
		type: string.isRequired
	};

	render() {
		let customFields = [];
		if (this.props.fields[this.props.type]) {
			const collections = this.props.collections;
			const fields = this.props.fields[this.props.type];
			customFields = Object.keys(fields).map(field => {
				const label = <label htmlFor={field}>{field}</label>;
				if (fields[field].kind === 'OBJECT') {
					if (fields[field].typeName === '*') {
						return (
							<div key={field}>
								{label}
								<Field name={field} component={LinkField} props={{ collections }} />
							</div>
						);
					}
					return (
						<div key={field}>
							{label}
							<Field name={field} component={LinkField} props={{ collections, type: fields[field].typeName }} />
						</div>
					);
				} else if (fields[field].kind === 'LIST') {
					if (fields[field].ofType === 'KeyValuePair') {
						return (
							<div key={field}>
								{label}
								<FieldArray name={field} component={KeyValueField} props={{ collections }} />
							</div>
						);
					}
					if (fields[field].typeName === '*') {
						return (
							<div key={field}>
								{label}
								<FieldArray name={field} component={LinksField} props={{ collections }} />
							</div>
						);
					}
					return (
						<div key={field}>
							{label}
							<FieldArray name={field} component={LinksField} props={{ collections, type: fields[field].typeName }} />
						</div>
					);
				}
				if (fields[field].typeName === 'JSON') {
					const format = value => JSON.stringify(value, null, 2);
					const parse = value => JSON.parse(value);
					return (
						<div key={field}>
							{label}
							<Field name={field} component="textarea" format={format} parse={parse} />
						</div>
					);
				} else if (fields[field].typeName === 'RichText') {
					return (
						<div key={field}>
							{label}
							<Field name={field} component="textarea" />
						</div>
					);
				}
				return (
					<div key={field}>
						{label}
						<Field name={field} component="input" type="text" />
					</div>
				);
			});
		}

		return (
			<form className="ObjectForm" onSubmit={this.props.handleSubmit}>
				<div>
					<label htmlFor="__id__">ID</label>
					<Field name="__id__" component="input" type="text" />
				</div>
				{customFields}
				<button type="button" onClick={this.props.handleDelete}>
					Delete
				</button>
				<button type="submit">Submit</button>
			</form>
		);
	}
}

export default reduxForm({
	form: 'GenericObject',
	enableReinitialize: true
})(GenericObjectForm);
