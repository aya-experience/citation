import React from 'react';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';
import { ActionCreators } from 'redux-undo';
import { buildPageTree } from 'citation-react-router';
import styled from 'styled-components';

import { loadPages, savePages } from '../../logic/sitemap';
import RootPage from './RootPage';
import EditPanel from './EditPanel';
import { Button } from '../common/Button';

const SitemapContainer = styled.div`
	position: relative;
	margin: 2rem auto;
	width: 80rem;
`;

const ActionBar = styled.div`
	display: flex;
	position: absolute;
	top: .5rem;
	right: .5rem;
`;

const enhancer = compose(
	connect(
		state => ({ sitemap: state.sitemap.present }),
		dispatch => ({
			load: () => dispatch(loadPages()),
			undo: () => dispatch(ActionCreators.undo()),
			redo: () => dispatch(ActionCreators.redo()),
			save: () => dispatch(savePages()),
			reset: () => dispatch(ActionCreators.jumpToPast(1))
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.load();
		}
	})
);

const Sitemap = ({ sitemap, undo, redo, save, reset }) => {
	const pageTree = buildPageTree(sitemap.pages);
	return (
		<SitemapContainer>
			<svg className="Sitemap" viewBox={`0 0 100 ${20 + pageTree.length * 20}`}>
				{pageTree.map((page, i) => <RootPage key={page.__id__ + i} page={page} position={{ x: 50, y: 20 + i * 20 }} />)}
			</svg>
			{sitemap.edition.page === null ? undefined : <EditPanel edition={sitemap.edition} />}
			<ActionBar>
				<Button icon="recycle" onClick={reset} />
				<Button icon="undo" onClick={undo} />
				<Button icon="redo" onClick={redo} />
				<Button icon="check" onClick={save} />
			</ActionBar>
		</SitemapContainer>
	);
};

Sitemap.propTypes = {
	sitemap: object.isRequired,
	undo: func.isRequired,
	redo: func.isRequired,
	save: func.isRequired,
	reset: func.isRequired
};

export default enhancer(Sitemap);
