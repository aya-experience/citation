import React from 'react';
import { object } from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Types from './Types';
import Objects from './Objects';
import ObjectComponent from './Object';

const Content = ({ match }) =>
	<main>
		<Switch>
			<Route exact path={`${match.url}`} component={Types} />
			<Route path={`${match.url}/type/:id`} component={Objects} />
			<Route path={`${match.url}/object/:type/:id`} component={ObjectComponent} />
			<Route path={`${match.url}/object/:type`} component={ObjectComponent} />
		</Switch>
	</main>;

Content.propTypes = {
	match: object.isRequired
};

export default Content;
