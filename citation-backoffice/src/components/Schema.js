import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadSchemaFields, loadSchema, writeSchema } from '../logic/schema';
import SchemaComponent from './schema/Schema';
import { filterSchemaFields } from './../utils/filters';

class Schema extends Component {
	static propTypes = {
		schema: PropTypes.array.isRequired,
		fields: PropTypes.object.isRequired,
		loadFields: PropTypes.func.isRequired,
		loadSchema: PropTypes.func.isRequired,
		write: PropTypes.func.isRequired
	};

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.props.loadSchema().then(() => this.props.loadFields(this.props.schema));
	}

	handleSubmit(values) {
		this.props.write(values);
	}

	render() {
		return (
			<div className="Schema">
				<h1>Edit Schema</h1>
				<SchemaComponent schema={this.props.schema} fields={this.props.fields} onSubmit={this.handleSubmit} />
			</div>
		);
	}
}

export const mapStateToProps = state => {
	return {
		schema: state.schema.data ? state.schema.data : [],
		fields: filterSchemaFields(state.fields)
	};
};

export const mapDispatchToProps = dispatch => {
	return {
		loadFields: schema => dispatch(loadSchemaFields(schema)),
		loadSchema: () => dispatch(loadSchema()),
		write: schema => dispatch(writeSchema(schema))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Schema);
