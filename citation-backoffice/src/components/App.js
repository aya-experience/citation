import { values } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { compose, lifecycle } from 'recompose';

import { loadTypes as loadModelTypes } from '../logic/model';
import { loadTypes as loadContentTypes } from '../logic/content';
import Header from './layout/Header';
import Home from './Home';
import Model from './Model';
import Content from './content/Content';
import Structure from './Structure';

import './style/global';

const NoMatch = () => (
	<div>
		<h1>Oups!</h1>
	</div>
);

const enhancer = compose(
	connect(
		state => ({
			types: values(state.model)
		}),
		dispatch => ({
			loadModelTypes: () => dispatch(loadModelTypes()),
			loadContentTypes: types => dispatch(loadContentTypes(types))
		})
	),
	lifecycle({
		componentDidMount() {
			this.props.loadModelTypes().then(() => this.props.loadContentTypes(this.props.types));
		}
	})
);

const App = () => (
	<BrowserRouter basename="/admin">
		<div>
			<Header />
			<Switch>
				<Route exact path="/" component={Home} />
				<Route path="/model" component={Model} />
				<Route path="/structure" component={Structure} />
				<Route path="/content" component={Content} />
				<Route component={NoMatch} />
			</Switch>
		</div>
	</BrowserRouter>
);

export default enhancer(App);
