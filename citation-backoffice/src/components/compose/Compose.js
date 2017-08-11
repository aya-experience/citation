import React from 'react';
import { object, string } from 'prop-types';
import { connect } from 'react-redux';
import { lifecycle, withProps, compose } from 'recompose';

import { loadPage, loadComponents } from '../../logic/compose';
import { loadSchemaFields } from '../../logic/schema';
import { startIframeMessageListener, stopIframeMessageListener } from './iframe-comunication';
import EditPanel from './EditPanel';

import './Compose.css';

const enhancer = compose(
	connect(
		state => ({ compose: state.compose }),
		(dispatch, { match }) => ({
			load: () => {
				dispatch(loadPage(match.params.id));
				dispatch(loadComponents());
				dispatch(loadSchemaFields(['Component']));
			}
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.load();
			startIframeMessageListener();
		},
		componentWillUnmount() {
			stopIframeMessageListener();
		}
	}),
	withProps(({ match }) => {
		const host = window.location.hostname === 'localhost' ? 'http://localhost:4000' : '';
		return { url: `${host}/edition/${match.params.id}` };
	})
);

const Page = ({ compose, url }) =>
	<div className="PageEdition-container">
		<h1>Edit page {compose.page.title}</h1>
		{compose.edition.component === null ? undefined : <EditPanel />}
		<iframe src={url} className="PageEdition-iframe" title="edition" />
	</div>;

Page.propTypes = {
	compose: object,
	url: string
};

export default enhancer(Page);
