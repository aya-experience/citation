import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { loadObject, writeObject } from '../logic/objects';
import { loadSchemaFields } from '../logic/schema';
import GenericObject from './forms/Object';
import { filterObjectFields } from './../utils/filters';
import './Object.css';

class ObjectComponent extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		object: PropTypes.object.isRequired,
		fields: PropTypes.object.isRequired,
		loadFields: PropTypes.func.isRequired,
		load: PropTypes.func.isRequired,
		write: PropTypes.func.isRequired
	};

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.props.loadFields([this.props.type]).then(() => this.props.load(this.props.fields));
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.type !== nextProps.type) {
			this.props.loadFields([nextProps.type]).then(() => this.props.load(nextProps.fields));
		}
	}

	handleSubmit(values) {
		this.props.write(values, this.props.fields);
	}

	render() {
		const Form = GenericObject;
		const Title = this.props.id ? 'Edit' : 'Add';
		return (
			<div className="Object">
				<h1>{Title} {this.props.type} {this.props.id}</h1>
				<Form
					type={this.props.type}
					object={this.props.object}
					fields={this.props.fields}
					onSubmit={this.handleSubmit}
				/>
			</div>
		);
	}
}

export const mapStateToProps = (state, ownProps) => {
	const { type, id } = ownProps.match.params;
	let object = _.get(state.objects, `${type}.${id}`, {});
	object = object === null ? {} : object;
	return { type, id, object, fields: filterObjectFields(state.fields) };
};

export const mapDispatchToProps = (dispatch, ownProps) => {
	const { type, id } = ownProps.match.params;
	return {
		loadFields: type => dispatch(loadSchemaFields([type])),
		load: fields => dispatch(loadObject(type, id, fields)),
		write: (data, fields) => dispatch(writeObject(type, id, data, fields))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ObjectComponent);
