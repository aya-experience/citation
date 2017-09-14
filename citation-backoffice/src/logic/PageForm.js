import React from 'react';
import { func } from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Field, reduxForm } from 'redux-form';

const enhancer = compose(
	connect(state => ({
		initialValues: state.sitemap.present.edition.page
	})),
	reduxForm({ form: 'page' })
);

const PageForm = ({ handleSubmit }) => (
	<form onSubmit={handleSubmit}>
		<div>
			<label htmlFor="__id__">Id</label>
			<Field name="__id__" component="input" type="text" />
		</div>
		<div>
			<label htmlFor="slug">Slug</label>
			<Field name="slug" component="input" type="text" />
		</div>
		<div>
			<label htmlFor="title">Title</label>
			<Field name="title" component="input" type="text" />
		</div>
		<button>Submit</button>
	</form>
);

PageForm.propTypes = {
	handleSubmit: func.isRequired
};

export default enhancer(PageForm);
