import React from 'react';
import { object } from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Sitemap from './sitemap/Sitemap';
import Compose from './compose/Compose';
import PageMetadata from './sitemap/PageMetadata';

const Content = ({ match }) => (
	<main>
		<Switch>
			<Route exact path={`${match.url}`} component={Sitemap} />
			<Route path={`${match.url}/compose/:id`} component={Compose} />
			<Route path={`${match.url}/metadata/:id`} component={PageMetadata} />
		</Switch>
	</main>
);

Content.propTypes = {
	match: object.isRequired
};

export default Content;
