import React from 'react';
import { object } from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';
import { connect } from 'react-redux';

import TypeList from './schema/TypeList';
import Schema from './schema/Schema';
import { loadSchema, loadSchemaFields } from '../logic/schema';

const enhancer = compose(
	connect(
		state => ({
			schema: state.schema.data ? state.schema.data : []
		}),
		dispatch => ({
			loadSchema: () => dispatch(loadSchema()),
			loadFields: schema => dispatch(loadSchemaFields(schema))
		})
	),
	lifecycle({
		componentDidMount() {
			return this.props.loadSchema().then(() => this.props.loadFields(this.props.schema));
		}
	})
);

const Content = ({ match }) => (
	<main>
		<Switch>
			<Route exact path={`${match.url}`} component={TypeList} />
			<Route path={`${match.url}/schema/:id`} component={Schema} />
		</Switch>
	</main>
);

Content.propTypes = {
	match: object.isRequired
};

export default enhancer(Content);
