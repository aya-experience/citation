import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Field, reduxForm} from 'redux-form';

import './ObjectForm.css';

class ObjectForm extends Component {
	static propTypes = {
		handleSubmit: PropTypes.func.isRequired
	}

	render() {
		return (
			<form className="ObjectForm" onSubmit={this.props.handleSubmit}>
				<div>
					<label htmlFor="title">Title</label>
					<Field name="title" component="input" type="text"/>
				</div>
				<div>
					<label htmlFor="content">Content</label>
					<Field name="content" component="input" type="text"/>
				</div>
				<button type="submit">Submit</button>
			</form>
		);
	}
}

export default reduxForm({form: 'object'})(ObjectForm);
