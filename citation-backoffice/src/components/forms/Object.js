import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';

import form2data from '../../utils/form2data';
import ObjectForm from './ObjectForm';

class GenericObject extends Component {
	static propTypes = {
		object: object.isRequired,
		type: object.isRequired,
		collections: object.isRequired,
		fields: object.isRequired,
		onSubmit: func.isRequired,
		onDelete: func.isRequired
	};

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(values) {
		const type = this.props.type;
		const fields = this.props.fields[type];
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
