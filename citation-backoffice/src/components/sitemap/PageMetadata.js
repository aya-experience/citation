import { find } from 'lodash';
import React from 'react';
import { object, func } from 'prop-types';
import { compose, withHandlers, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import { editPage, loadPages } from '../../logic/sitemap';
import PageForm from './PageForm';
import { Breadcrumb } from '../common/Breadcrumb';
import { Link } from '../common/Link';

const enhancer = compose(
	connect(
		(state, ownProps) => ({
			page: find(state.sitemap.present.pages, {
				_id_: ownProps.match.params.id
			})
		}),
		dispatch => ({
			load: () => dispatch(loadPages()),
			save: (oldPage, page) => dispatch(editPage({ oldPage, page }))
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.load();
		}
	}),
	withHandlers({
		submit: ({ save, edition }) => data => save(edition.page, data)
	})
);

const PageMetadata = ({ page, submit }) =>
	page ? (
		<div>
			<Breadcrumb>
				<Link to="/structure">STRUCTURE</Link> / {page._id_}
			</Breadcrumb>
			<PageForm initialValues={page} onSubmit={submit} />
		</div>
	) : null;

PageMetadata.propTypes = {
	page: object,
	submit: func.isRequired
};

export default enhancer(PageMetadata);
