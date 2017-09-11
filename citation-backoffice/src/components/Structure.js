import React from 'react';
import { object } from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Sitemap from './sitemap/Sitemap';
import Compose from './compose/Compose';

const Content = ({ match }) =>
	<main>
		<Switch>
			<Route exact path={`${match.url}`} component={Sitemap} />
			<Route path={`${match.url}/compose/:id`} component={Compose} />
		</Switch>
	</main>;

Content.propTypes = {
	match: object.isRequired
};

export default Content;
