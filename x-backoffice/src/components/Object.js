import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {loadObject, writeObject} from '../logic/objects';
import ObjectForm from './ObjectForm';

import './Object.css';

class ObjectComponent extends Component {
	static propTypes = {
		slug: PropTypes.string.isRequired,
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

	handleSubmit(values) {
		this.props.write(values);
	}

	render() {
		return (
			<div className="Object">
				<h1>Edit object {this.props.slug}</h1>
				<ObjectForm onSubmit={this.handleSubmit} initialValues={this.props.object}/>
			</div>
		);
	}
}

export const mapStateToProps = (state, ownProps) => {
	return {
		slug: ownProps.params.slug,
		object: _.get(state.objects, `pages.${ownProps.params.slug}`, {})
	};
};

export const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		load: () => dispatch(loadObject('pages', ownProps.params.slug)),
		write: data => dispatch(writeObject('pages', ownProps.params.slug, data))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ObjectComponent);
