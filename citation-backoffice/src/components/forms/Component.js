import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import ComponentForm from './ComponentForm';
import {toLinksInput} from './LinksField';

class ComponentComponent extends Component {
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
		const result = {component: _.clone(values)};
		result.component.children = toLinksInput(values.children, 'Component');
		result.component.data = toLinksInput(values.data);
		this.props.onSubmit(result);
	}

	render() {
		const formProps = {
			onSubmit: this.handleSubmit,
			initialValues: this.props.object,
			collections: this.props.collections
		};

		return <ComponentForm {...formProps}/>;
	}
}

export const mapStateToProps = (state, ownProps) => {
	return {
		object: ownProps.object,
		collections: state.collections
	};
};

export default connect(mapStateToProps)(ComponentComponent);
