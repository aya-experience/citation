import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import ObjectForm from './ObjectForm';
import { toLinkInput } from './LinkField';
import { toLinksInput } from './LinksField';
import { toKeyValueInput } from './KeyValueField';

class GenericObject extends Component {
	static propTypes = {
		object: PropTypes.object.isRequired,
		type: PropTypes.object.isRequired,
		collections: PropTypes.object.isRequired,
		fields: PropTypes.object.isRequired,
		onSubmit: PropTypes.func.isRequired
	};

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(values) {
		const result = {};
		const type = this.props.type;
		result[type] = _.mapValues(values, (value, key) => {
			const field = this.props.fields[type][key];
			if (field) {
				if (field.ofType === 'KeyValuePair') {
					return toKeyValueInput(value);
				} else if (field.kind === 'LIST') {
					return toLinksInput(value, field.typeName);
				} else if (field.kind === 'OBJECT') {
					return toLinkInput(value, field.typeName);
				}
			}
			return value ? value : '';
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
		return <ObjectForm {...formProps} />;
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
