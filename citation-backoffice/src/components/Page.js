import { get } from 'lodash';
import React from 'react';
import { object, string } from 'prop-types';
import { connect } from 'react-redux';
import { lifecycle, withProps, compose } from 'recompose';
import { loadObject } from '../logic/objects';
import { loadSchemaFields } from '../logic/schema';

import './Page.css';

const enhancer = compose(
	connect(
		(state, ownProps) => {
			const id = ownProps.match.params.id;
			let page = get(state.objects, `Page.${id}`, {});
			page = page === null ? {} : page;
			console.log('coucou', state.objects, id, page);
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
	}),
	withProps(({ page }) => {
		const host = window.location.hostname === 'localhost' ? 'http://localhost:4000' : '';
		const path = page.slug === null ? '' : page.slug;
		return { url: `${host}/edition/${path}` };
	})
);

const Page = ({ page, url }) =>
	<div className="PageEdition-container">
		<h1>Edit page {page.title}</h1>
		<iframe src={url} className="PageEdition-iframe" title="preview" />
	</div>;

Page.propTypes = {
	page: object,
	url: string
};

export default enhancer(Page);
