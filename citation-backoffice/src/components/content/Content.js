import React from 'react';
import { object } from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import TypeList from './TypeList';
import EntryList from './EntryList';
import Entry from './Entry';

const Content = ({ match }) => (
	<main>
		<Switch>
			<Route exact path={`${match.url}`} component={TypeList} />
			<Route path={`${match.url}/type/:id`} component={EntryList} />
			<Route path={`${match.url}/entry/:type/:id`} component={Entry} />
			<Route path={`${match.url}/entry/:type`} component={Entry} />
		</Switch>
	</main>
);

Content.propTypes = {
	match: object.isRequired
};

export default Content;
