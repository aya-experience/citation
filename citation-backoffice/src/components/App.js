import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { compose, lifecycle } from 'recompose';

import { loadCollection } from '../logic/collections';
import { loadSchema } from '../logic/schema';
import Header from './layout/Header';
import Home from './Home';
import Model from './Model';
import Content from './content/Content';
import Structure from './Structure';

import './style/global';

const NoMatch = () =>
	<div>
		<h1>Oups!</h1>
	</div>;

const enhancer = compose(
	connect(
		state => {
			return {
				collections: state.collections,
				schema: state.schema
			};
		},
		dispatch => {
			return {
				loadSchema: () => dispatch(loadSchema()),
				loadCollections: schema => dispatch(loadCollection(schema.data))
			};
		}
	),
	lifecycle({
		componentDidMount() {
			this.props.loadSchema().then(() => this.props.loadCollections(this.props.schema));
		}
	})
);

const App = () =>
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
	</BrowserRouter>;

export default enhancer(App);
