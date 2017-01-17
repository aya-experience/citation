import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import LinkField from './LinkField';
import LinksField from './LinksField';

import './ObjectForm.css';

class ObjectForm extends Component {
	static propTypes = {
		handleSubmit: PropTypes.func.isRequired,
		collections: PropTypes.object.isRequired
	}

	render() {
		const collections = this.props.collections;
		return (
			<form className="ObjectForm" onSubmit={this.props.handleSubmit}>
				<div>
					<label htmlFor="__id__">ID</label>
					<Field name="__id__" component="input" type="text"/>
				</div>
				<div>
					<label htmlFor="slug">Slug</label>
					<Field name="slug" component="input" type="text"/>
				</div>
				<div>
					<label htmlFor="title">Title</label>
					<Field name="title" component="input" type="text"/>
				</div>
				<div>
					<label htmlFor="component">Component</label>
					<Field name="component" component={LinkField} props={{collections, type: 'Component'}}/>
				</div>
				<div>
					<label htmlFor="children">Children</label>
					<FieldArray name="children" component={LinksField} props={{collections, type: 'Page'}}/>
				</div>
				<button type="submit">Submit</button>
			</form>
		);
	}
}

export default reduxForm({
	form: 'Page',
	enableReinitialize: true
})(ObjectForm);
