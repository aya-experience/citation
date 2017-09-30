import React from 'react';
import { object } from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { lifecycle, compose } from 'recompose';

import { loadPage, loadComponents } from '../../logic/compose';
import { loadTypeFields } from '../../logic/model';
import Page from './Page';
import Component from './Component';

const enhancer = compose(
	connect(null, (dispatch, { match }) => ({
		load: () => {
			dispatch(loadPage(match.params.id));
			dispatch(loadComponents());
			dispatch(loadTypeFields('Component'));
		}
	})),
	lifecycle({
		componentDidMount() {
			this.props.load();
		}
	})
);

const Compose = ({ match }) => (
	<main>
		<Switch>
			<Route exact path={`${match.url}`} component={Page} />
			<Route path={`${match.url}/component/parent/:parentId`} component={Component} />
			<Route path={`${match.url}/component/:id`} component={Component} />
		</Switch>
	</main>
);

Compose.propTypes = {
	match: object.isRequired
};

export default enhancer(Compose);
