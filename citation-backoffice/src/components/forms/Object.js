import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import form2data from '../../utils/form2data';
import ObjectForm from './ObjectForm';

class GenericObject extends Component {
	static propTypes = {
		object: PropTypes.object.isRequired,
		type: PropTypes.object.isRequired,
		collections: PropTypes.object.isRequired,
		fields: PropTypes.object.isRequired,
		onSubmit: PropTypes.func.isRequired,
		onDelete: PropTypes.func.isRequired
	};

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(values) {
		// const result = {};
		const type = this.props.type;
		const fields = this.props.fields[type];
		// result[type] = form2data(values, fields);
		this.props.onSubmit(form2data(values, fields));
	}

	render() {
		const formProps = {
			onSubmit: this.handleSubmit,
			handleDelete: this.props.onDelete,
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
