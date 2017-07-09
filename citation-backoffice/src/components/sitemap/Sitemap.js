import React from 'react';
import { object, func } from 'prop-types';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';
import { ActionCreators } from 'redux-undo';
import { buildPageTree } from 'citation-react-router';

import { loadPages, savePages } from '../../logic/sitemap';
import RootPage from './RootPage';
import EditPanel from './EditPanel';

import './Sitemap.css';

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

const Sitemap = ({ sitemap, undo, redo, save, reset }) =>
	<div className="SitemapContainer">
		<svg className="Sitemap" viewBox="0 0 100 100">
			{buildPageTree(sitemap.pages).map((page, i) =>
				<RootPage key={page.__id__ + i} page={page} position={{ x: 50, y: 20 + i * 20 }} />
			)}
		</svg>
		{sitemap.edition.page === null ? undefined : <EditPanel edition={sitemap.edition} />}
		<div className="ActionBar">
			<button onClick={reset}>Reset</button>
			<button onClick={undo}>Undo</button>
			<button onClick={redo}>Redo</button>
			<button onClick={save}>Save</button>
		</div>
	</div>;

Sitemap.propTypes = {
	sitemap: object.isRequired,
	undo: func.isRequired,
	redo: func.isRequired,
	save: func.isRequired,
	reset: func.isRequired
};

export default enhancer(Sitemap);
