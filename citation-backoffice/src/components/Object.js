import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {loadObject, writeObject} from '../logic/objects';
import Page from './forms/Page';
import ComponentComponent from './forms/Component';
import Content from './forms/Content';

import './Object.css';

class ObjectComponent extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		object: PropTypes.object.isRequired,
		load: PropTypes.func.isRequired,
		write: PropTypes.func.isRequired
	}

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		return this.props.load();
	}

	componentDidUpdate() {
		return this.props.load();
	}

	handleSubmit(values) {
		this.props.write(values);
	}

	render() {
		const forms = {Page, Component: ComponentComponent, Content};
		const Form = forms[this.props.type];

		return (
			<div className="Object">
				<h1>Edit {this.props.type} {this.props.id}</h1>
				<Form object={this.props.object} onSubmit={this.handleSubmit}/>
			</div>
		);
	}
}

export const mapStateToProps = (state, ownProps) => {
	const {type, id} = ownProps.params;
	let object = _.get(state.objects, `${type}.${id}`, {});
	object = object === null ? {} : object;
	return {type, id, object};
};

export const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		load: () => dispatch(loadObject(ownProps.params.type, ownProps.params.id)),
		write: data => dispatch(writeObject(ownProps.params.type, ownProps.params.id, data))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ObjectComponent);
