import React from 'react';
import { object, func, number } from 'prop-types';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';
import { ActionCreators } from 'redux-undo';
import { buildPageTree } from 'citation-react-router';
import styled from 'styled-components';

import { loadPages, savePages } from '../../logic/sitemap';
import RootPage from './RootPage';
import { Button } from '../common/Button';
import { Breadcrumb } from '../common/Breadcrumb';
import dimensions from '../../utils/dimensions';

const SitemapContainer = styled.div`
	position: relative;
	margin: 2rem auto;
	width: 100%;
`;

const ActionBar = styled.div`
	display: flex;
	position: absolute;
	top: 0.5rem;
	right: 0.5rem;
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
	}),
	dimensions()
);

const Sitemap = ({ sitemap, undo, redo, save, reset, containerWidth }) => {
	const pageTree = buildPageTree(sitemap.pages);
	return (
		<div>
			<Breadcrumb>STRUCTURE / Configure your sitemap...</Breadcrumb>
			<SitemapContainer>
				<svg
					className="Sitemap"
					viewBox={`${(100 - containerWidth / 10) / 2} 0 ${containerWidth / 10} ${20 +
						pageTree.length * 20}`}
				>
					{pageTree.map((page, i) => (
						<RootPage key={page._id_ + i} page={page} position={{ x: 50, y: 20 + i * 20 }} />
					))}
				</svg>
				<ActionBar>
					<Button icon="recycle" onClick={reset} />
					<Button icon="undo" onClick={undo} />
					<Button icon="redo" onClick={redo} />
					<Button icon="check" onClick={save} />
				</ActionBar>
			</SitemapContainer>
		</div>
	);
};

Sitemap.propTypes = {
	sitemap: object.isRequired,
	undo: func.isRequired,
	redo: func.isRequired,
	save: func.isRequired,
	reset: func.isRequired,
	containerWidth: number.isRequired
};

export default enhancer(Sitemap);
