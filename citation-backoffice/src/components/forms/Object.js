import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ObjectForm from './ObjectForm';
import {toLinkInput} from './LinkField';
import {toLinksInput} from './LinksField';

class GenericObject extends Component {
	static propTypes = {
		object: PropTypes.object.isRequired,
		type: PropTypes.object.isRequired,
		collections: PropTypes.object.isRequired,
		fields: PropTypes.object.isRequired,
		onSubmit: PropTypes.func.isRequired
	}

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(values) {
		const result = {};
		const type = this.props.type;
		result[type] = _.clone(values);
		Object.keys(result[type]).forEach(key => {
			if (_.isArray(result[type][key])) {
				if (this.props.fields[type][key].typeName === '*') {
					result[type][key] = toLinksInput(values[key]);
				} else {
					result[type][key] = toLinksInput(values[key], this.props.fields[type][key].typeName);
				}
			} else if (_.isObject(result[type][key])) {
				if (this.props.fields[type][key].typeName === '*') {
					result[type][key] = toLinkInput(values[key]);
				} else {
					result[type][key] = toLinkInput(values[key], this.props.fields[type][key].typeName);
				}
			}
		});
		this.props.onSubmit(result);
	}

	render() {
		const formProps = {
			onSubmit: this.handleSubmit,
			initialValues: this.props.object,
			collections: this.props.collections,
			fields: this.props.fields,
			type: this.props.type
		};
		return <ObjectForm {...formProps}/>;
	}
}

export const mapStateToProps = (state, ownProps) => {
	return {
		object: ownProps.object,
		collections: state.collections,
		fields: ownProps.fields
	};
};

export default connect(mapStateToProps)(GenericObject);
