import _ from 'lodash';
import React, { Component } from 'react';
import { string, object, func } from 'prop-types';
import { connect } from 'react-redux';
import { loadObject, writeObject, deleteObject } from '../logic/objects';
import { loadSchemaFields } from '../logic/schema';
import GenericObject from './forms/Object';
import { filterObjectFields } from './../utils/filters';
import './Object.css';

class ObjectComponent extends Component {
	static propTypes = {
		id: string.isRequired,
		type: string.isRequired,
		object: object.isRequired,
		fields: object.isRequired,
		loadFields: func.isRequired,
		load: func.isRequired,
		write: func.isRequired,
		delete: func.isRequired
	};

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	componentDidMount() {
		this.props.loadFields([this.props.type]).then(() => this.props.load(this.props.fields));
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.fields[nextProps.type]) {
			nextProps.load(this.props.fields);
		} else {
			nextProps.loadFields([nextProps.type]).then(() => nextProps.load(this.props.fields));
		}
	}

	handleSubmit(values) {
		this.props.write(values, this.props.fields);
	}

	handleDelete() {
		this.props.delete();
	}

	render() {
		const title = this.props.id ? 'Edit' : 'Add';
		return (
			<div className="Object">
				<h1>{title} {this.props.type} {this.props.id}</h1>
				<GenericObject
					type={this.props.type}
					object={this.props.object}
					fields={this.props.fields}
					onSubmit={this.handleSubmit}
					onDelete={this.handleDelete}
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
		write: (data, fields) => dispatch(writeObject(type, id, data, fields)),
		delete: () => deleteObject(type, id)
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ObjectComponent);
