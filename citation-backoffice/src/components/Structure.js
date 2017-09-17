import React from 'react';
import { object } from 'prop-types';
import { Route, Switch } from 'react-router-dom';

import Sitemap from './sitemap/Sitemap';
import PageMetadata from './sitemap/PageMetadata';
import Compose from './compose/Compose';
import Component from './compose/Component';

const Content = ({ match }) => (
	<main>
		<Switch>
			<Route exact path={`${match.url}`} component={Sitemap} />
			<Route path={`${match.url}/metadata/:id`} component={PageMetadata} />
			<Route path={`${match.url}/compose/:id`} component={Compose} />
			<Route path={`${match.url}/component/:id`} component={Component} />
		</Switch>
	</main>
);

Content.propTypes = {
	match: object.isRequired
};

export default Content;
