import { get } from 'lodash';
import React from 'react';
import { object, string } from 'prop-types';
import { connect } from 'react-redux';
import { lifecycle, withProps, compose } from 'recompose';
import styled from 'styled-components';
import { withRouter } from 'react-router';

import hideIf from '../../utils/hide-if';
import { startIframeMessageListener, stopIframeMessageListener } from './iframe-comunication';
import { Breadcrumb } from '../common/Breadcrumb';
import { Link } from '../common/Link';
import { darkBlue } from '../style/colors';

const Iframe = styled.iframe`
	border: solid 0.1rem ${darkBlue};
	display: block;
	width: 80rem;
	margin: auto;
	height: 80vh;
`;

const enhancer = compose(
	connect(state => ({ compose: state.compose })),
	hideIf(({ compose }) => !get(compose, 'page.__id__')),
	withRouter,
	lifecycle({
		componentDidMount() {
			startIframeMessageListener(this.props.compose.page.__id__, this.props.history);
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

const Page = ({ compose, url }) => (
	<div>
		<Breadcrumb>
			<Link to="/structure">STRUCTURE</Link> / {compose.page.__id__}
		</Breadcrumb>
		<Iframe src={url} title="edition" />
	</div>
);

Page.propTypes = {
	compose: object,
	url: string
};

export default enhancer(Page);
