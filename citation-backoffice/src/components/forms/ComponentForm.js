import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import LinksField from './LinksField';

import './ObjectForm.css';

class ComponentForm extends Component {
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
					<label htmlFor="type">Type</label>
					<Field name="type" component="input" type="text"/>
				</div>
				<div>
					<label htmlFor="children">Children</label>
					<FieldArray name="children" component={LinksField} props={{collections, type: 'Component'}}/>
				</div>
				<div>
					<label htmlFor="data">Data</label>
					<FieldArray name="data" component={LinksField} props={{collections}}/>
				</div>
				<button type="submit">Submit</button>
			</form>
		);
	}
}

export default reduxForm({
	form: 'Component',
	enableReinitialize: true
})(ComponentForm);
