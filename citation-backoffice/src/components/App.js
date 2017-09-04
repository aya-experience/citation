import React, { Component } from 'react';
import { object, func } from 'prop-types';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';

import { loadCollection } from '../logic/collections';
import { loadSchema } from '../logic/schema';
import Header from './layout/Header';
import Home from './Home';
import Schema from './Schema';
import Compose from './compose/Compose';
import Content from './content/Content';
import Sitemap from './sitemap/Sitemap';

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
				<div className="App">
					<Header />
					<div className="App-layout">
						{/* <Menu collections={this.props.collections} /> */}
						<div className="App-content">
							<Switch>
								<Route exact path="/" component={Home} />
								<Route exact path="/model" component={Schema} />
								<Route exact path="/sitemap" component={Sitemap} />
								<Route exact path="/compose/:id" component={Compose} />
								<Route path="/content" component={Content} />
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
		loadSchema: () => dispatch(loadSchema()),
		loadCollections: schema => dispatch(loadCollection(schema.data))
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
