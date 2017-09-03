import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadCollection } from '../logic/collections';
import { loadSchema } from '../logic/schema';
import Header from './layout/Header';
import Menu from './Menu';
import Home from './Home';
import ObjectComponent from './Object';
import Schema from './Schema';
import Compose from './compose/Compose';
import Sitemap from './sitemap/Sitemap';

import './style/global';

import './App.css';

const NoMatch = () =>
	<div>
		<h1>Oups!</h1>
	</div>;

class App extends Component {
	static propTypes = {
		schema: object.isRequired,
		collections: object.isRequired,
		loadCollections: func.isRequired,
		loadSchema: func.isRequired
	};

	componentDidMount() {
		this.props.loadSchema().then(() => this.props.loadCollections(this.props.schema));
	}

	render() {
		return (
			<BrowserRouter basename="/admin">
				<div className="App">
					<Header />
					<div className="App-layout">
						<Menu collections={this.props.collections} />
						<div className="App-content">
							<Switch>
								<Route exact path="/" component={Home} />
								<Route exact path="/model" component={Schema} />
								<Route exact path="/compose/:id" component={Compose} />
								<Route exact path="/sitemap" component={Sitemap} />
								<Route exact path="/object/:type" component={ObjectComponent} />
								<Route path="/object/:type/:id" component={ObjectComponent} />
								<Route component={NoMatch} />
							</Switch>
						</div>
					</div>
				</div>
			</BrowserRouter>
		);
	}
}

const mapStateToProps = state => {
	return {
		collections: state.collections,
		schema: state.schema
	};
};

const mapDispatchToProps = dispatch => {
	return {
		loadSchema: () => Promise.all([dispatch(loadSchema())]),
		loadCollections: schema => Promise.all([dispatch(loadCollection(schema.data))])
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
