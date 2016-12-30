import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {loadObject, writeObject} from '../logic/objects';
import ObjectForm from './forms/ObjectForm';
import PageForm from './forms/PageForm';

import './Object.css';

class ObjectComponent extends Component {
	static propTypes = {
		id: PropTypes.string.isRequired,
		type: PropTypes.string.isRequired,
		object: PropTypes.object.isRequired,
		components: PropTypes.array.isRequired,
		pages: PropTypes.array.isRequired,
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
		let result;
		switch (this.props.type) {
			case 'Page':
				result = {page: _.clone(values)};
				result.page.component = {
					__role__: 'link',
					link: {
						id: values.component.__id__,
						collection: 'Component'
					}
				};
				result.page.children = {
					__role__: 'links',
					links: values.children.map(child => ({
						id: child.__id__,
						collection: 'Page'
					}))
				};
				break;
			default:
				break;
		}
		this.props.write(result);
	}

	render() {
		const formProps = {
			onSubmit: this.handleSubmit,
			initialValues: this.props.object
		};
		let form;
		switch (this.props.type) {
			case 'Page':
				form = <PageForm {...formProps} components={this.props.components} pages={this.props.pages}/>;
				break;
			default:
				form = <ObjectForm {...formProps}/>;
		}

		return (
			<div className="Object">
				<h1>Edit {this.props.type} {this.props.id}</h1>
				{form}
			</div>
		);
	}
}

export const mapStateToProps = (state, ownProps) => {
	const {type, id} = ownProps.params;
	return {
		type,
		id,
		object: _.get(state.objects, `${type}.${id}`, {}),
		components: _.get(state.collections, 'Component', []),
		pages: _.get(state.collections, 'Page', [])
	};
};

export const mapDispatchToProps = (dispatch, ownProps) => {
	return {
		load: () => dispatch(loadObject(ownProps.params.type, ownProps.params.id)),
		write: data => dispatch(writeObject(ownProps.params.type, data))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(ObjectComponent);
