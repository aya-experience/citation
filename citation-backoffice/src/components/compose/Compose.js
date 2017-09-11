import React from 'react';
import { object, string } from 'prop-types';
import { connect } from 'react-redux';
import { lifecycle, withProps, compose } from 'recompose';
import styled from 'styled-components';

import { loadPage, loadComponents } from '../../logic/compose';
import { loadSchemaFields } from '../../logic/schema';
import { startIframeMessageListener, stopIframeMessageListener } from './iframe-comunication';
import EditPanel from './EditPanel';
import { Breadcrumb } from '../common/Breadcrumb';
import { Link } from '../common/Link';
import { darkBlue } from '../style/colors';

const Iframe = styled.iframe`
	border: solid .1rem ${darkBlue};
	display: block;
	width: 80rem;
	margin: auto;
	height: 80vh;
`;

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
	<div>
		<Breadcrumb>
			<Link to="/structure">STRUCTURE</Link> / {compose.page.__id__}
		</Breadcrumb>
		{compose.edition.component === null ? undefined : <EditPanel />}
		<Iframe src={url} title="edition" />
	</div>;

Page.propTypes = {
	compose: object,
	url: string
};

export default enhancer(Page);
