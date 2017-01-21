import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ContentForm from './ContentForm';

class Content extends Component {
	static propTypes = {
		object: PropTypes.object.isRequired,
		collections: PropTypes.object.isRequired,
		onSubmit: PropTypes.func.isRequired
	}

	constructor() {
		super();
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(values) {
		const result = {content: _.clone(values)};
		this.props.onSubmit(result);
	}

	render() {
		const formProps = {
			onSubmit: this.handleSubmit,
			initialValues: this.props.object,
			collections: this.props.collections
		};

		return <ContentForm {...formProps}/>;
	}
}

export const mapStateToProps = (state, ownProps) => {
	return {
		object: ownProps.object,
		collections: state.collections
	};
};

export default connect(mapStateToProps)(Content);
