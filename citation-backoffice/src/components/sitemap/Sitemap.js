import React from 'react';
import { array } from 'prop-types';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';

import { loadPages } from '../../logic/sitemap';
import RootPage from './RootPage';

import './Sitemap.css';

const enhancer = compose(
	connect(state => ({ pages: state.sitemap.pages }), dispatch => ({ load: () => dispatch(loadPages()) })),
	lifecycle({
		componentDidMount() {
			this.props.load();
		}
	})
);

const Sitemap = ({ pages }) =>
	<svg className="Sitemap" viewBox="0 0 100 100">
		{pages.map((page, i) => <RootPage key={page.__id__ + i} page={page} position={{ x: 50, y: 20 + i * 20 }} />)}
	</svg>;

Sitemap.propTypes = {
	pages: array.isRequired
};

export default enhancer(Sitemap);
