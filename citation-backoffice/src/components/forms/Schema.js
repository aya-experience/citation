import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import SchemaForm from './SchemaForm';

class SchemaComponent extends Component {
	static propTypes = {
		schema: PropTypes.array.isRequired,
		schemaFields: PropTypes.object.isRequired,
		onSubmit: PropTypes.func.isRequired
	}

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(values) {
		console.log('firstSubmit', values);
	}

	render() {
		const actualValues = _.cloneDeep(this.props.schemaFields);
		const initialValues = {};
		Object.keys(actualValues).filter(key => key !== 'Page' && key !== 'Component' && key !== 'Content' && key !== 'Schema').map(key => {
			initialValues[key] = Object.keys(actualValues[key]).filter(field => !/^__/.test(field)).map(field => {
				actualValues[key][field].name = field;
				return actualValues[key][field];
			});
			return initialValues;
		});
		console.log('my initialValues', initialValues);
		const formProps = {
			onSubmit: this.handleSubmit,
			fields: this.props.schemaFields,
			initialValues,
			schema: this.props.schema.filter(field => field !== 'Schema')
		};
		return <SchemaForm {...formProps}/>;
	}
}

export const mapStateToProps = (state, ownProps) => {
	return {
		schema: ownProps.schema,
		schemaFields: ownProps.schemaFields
	};
};

export default connect(mapStateToProps)(SchemaComponent);
