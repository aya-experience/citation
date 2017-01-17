import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import PageForm from './PageForm';
import {toLinkInput} from './LinkField';
import {toLinksInput} from './LinksField';

class PageComponent extends Component {
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
		const result = {page: _.clone(values)};
		result.page.component = toLinkInput(values.component, 'Component');
		result.page.children = toLinksInput(values.children, 'Page');
		this.props.onSubmit(result);
	}

	render() {
		const formProps = {
			onSubmit: this.handleSubmit,
			initialValues: this.props.object,
			collections: this.props.collections
		};

		return <PageForm {...formProps}/>;
	}
}

export const mapStateToProps = (state, ownProps) => {
	return {
		object: ownProps.object,
		collections: state.collections
	};
};

export default connect(mapStateToProps)(PageComponent);
