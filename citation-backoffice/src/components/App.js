import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

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

class App extends Component {
	static propTypes = {
		schema: object.isRequired,
		loadCollections: func.isRequired,
		loadSchema: func.isRequired
	};

	componentDidMount() {
		this.props.loadSchema().then(() => this.props.loadCollections(this.props.schema));
	}

	render() {
		return (
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
		loadSchema: () => dispatch(loadSchema()),
		loadCollections: schema => dispatch(loadCollection(schema.data))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
