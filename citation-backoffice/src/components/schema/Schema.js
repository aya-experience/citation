import _ from 'lodash';
import React, { Component } from 'react';
import { array, object, func } from 'prop-types';
import { connect } from 'react-redux';
import SchemaForm from './SchemaForm';

class SchemaComponent extends Component {
	static propTypes = {
		schema: array.isRequired,
		fields: object.isRequired,
		onSubmit: func.isRequired
	};

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(values) {
		const result = _.clone(values);
		const schema = { schema: {} };
		schema.schema.types = Object.keys(result.data).map(type => {
			const field = { name: result.data[type].__name__ };
			delete result.data[type].__name__;
			field.fields = Object.keys(result.data[type].__fields__).map(key => {
				const field = result.data[type].__fields__[key];
				if (field.kind === 'OBJECT') {
					return { name: field.name, type: ['link', field.typeName] };
				} else if (field.kind === 'LIST') {
					return { name: field.name, type: ['links', field.typeName] };
				}
				return { name: field.name, type: field.kind.toLowerCase() };
			});
			return field;
		});
		this.props.onSubmit(schema);
	}

	render() {
		const actualValues = _.cloneDeep(this.props.fields);
		const initialValues = {
			data: Object.keys(actualValues)
				.filter(key => key !== 'Page' && key !== 'Component' && key !== 'Content' && key !== 'Schema')
				.map(key => ({
					__name__: key,
					__fields__: Object.keys(actualValues[key]).map(field => {
						actualValues[key][field].name = field;
						actualValues[key][field].kind = actualValues[key][field].kind === 'SCALAR'
							? actualValues[key][field].typeName
							: actualValues[key][field].kind;
						return actualValues[key][field];
					})
				}))
		};
		const formProps = {
			onSubmit: this.handleSubmit,
			fields: this.props.fields,
			initialValues,
			schema: this.props.schema
		};
		return <SchemaForm {...formProps} />;
	}
}

export const mapStateToProps = (state, ownProps) => {
	return {
		schema: ownProps.schema,
		fields: ownProps.fields
	};
};

export default connect(mapStateToProps)(SchemaComponent);
