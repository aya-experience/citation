import React from 'react';
import { object } from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import TypeList from './schema/TypeList';
import Type from './schema/Type';
import { loadTypes } from '../logic/model';

const enhancer = compose(
	connect(null, dispatch => ({
		loadSchema: () => dispatch(loadTypes())
	})),
	lifecycle({
		componentDidMount() {
			return this.props.loadSchema();
		}
	})
);

const Content = ({ match }) => (
	<main>
		<Switch>
			<Route exact path={`${match.url}`} component={TypeList} />
			<Route path={`${match.url}/type/:id`} component={Type} />
		</Switch>
	</main>
);

Content.propTypes = {
	match: object.isRequired
};

export default enhancer(Content);
