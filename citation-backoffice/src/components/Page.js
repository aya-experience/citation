import _ from 'lodash';
import React from 'react';
import { object } from 'prop-types';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';
import { loadObject } from '../logic/objects';
import { loadSchemaFields } from '../logic/schema';

import './Page.css';

const enhancer = compose(
	connect(
		(state, ownProps) => {
			const id = ownProps.match.params.id;
			let page = _.get(state.objects, `Page.${id}`, {});
			page = page === null ? {} : page;
			return { id, page, fields: state.fields };
		},
		(dispatch, ownProps) => ({
			loadFields: () => dispatch(loadSchemaFields(['Page'])),
			load: fields => dispatch(loadObject('Page', ownProps.match.params.id, fields))
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.loadFields().then(() => this.props.load(this.props.fields));
		}
	})
);

const Page = ({ page }) =>
	<div>
		<h1>Edit page {page.title}</h1>
		<iframe src={`/preview/${page.slug}`} className="preview" />
	</div>;

Page.propTypes = {
	page: object
};

export default enhancer(Page);
