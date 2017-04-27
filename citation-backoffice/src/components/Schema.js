import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {loadAllSchemaFields, loadSchema} from '../logic/schema';
import SchemaComponent from './forms/Schema';

class Schema extends Component {
	static propTypes = {
		schema: PropTypes.array.isRequired,
		schemaFields: PropTypes.object.isRequired,
		loadFields: PropTypes.func.isRequired,
		loadSchema: PropTypes.func.isRequired
	};

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.props.loadSchema().then(this.props.loadFields(this.props.schema));
	}

	handleSubmit(values) {
		console.log('submitted', values);
	}

	render() {
		const Form = SchemaComponent;
		return (
			<div className="Schema">
				<h1>Edit Schema</h1>
				<Form schema={this.props.schema} schemaFields={this.props.schemaFields} onSubmit={this.handleSubmit}/>
			</div>
		);
	}
}

export const mapStateToProps = state => {
	return {
		schema: state.schema.data ? state.schema.data : [],
		schemaFields: state.schemaFields
	};
};

export const mapDispatchToProps = dispatch => {
	return {
		loadFields: schema => Promise.all([
			schema.map(fieldName => dispatch(loadAllSchemaFields(fieldName)))
		]),
		loadSchema: () => Promise.all([
			dispatch(loadSchema())
		])
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Schema);
