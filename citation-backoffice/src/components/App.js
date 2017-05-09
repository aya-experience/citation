import React, {Component, PropTypes} from 'react';
import {Route, Link, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import {loadCollection} from '../logic/collections';
import {loadSchema} from '../logic/schema';

import Menu from './Menu';
import Home from './Home';
import ObjectComponent from './Object';
import Schema from './Schema';

import './App.css';

const NoMatch = () => <div><h1>Oups!</h1></div>;

class App extends Component {
	static propTypes = {
		schema: PropTypes.object.isRequired,
		collections: PropTypes.object.isRequired,
		loadCollections: PropTypes.func.isRequired,
		loadSchema: PropTypes.func.isRequired
	}

	componentDidMount() {
		this.props.loadSchema().then(() => this.props.loadCollections(this.props.schema));
	}

	render() {
		return (
			<div className="App">
				<div className="App-header">
					<Link to="/">
						<img src="/logo.svg" className="App-logo" alt="logo"/>
						<h2>Citation Admin</h2>
					</Link>
				</div>
				<div className="App-layout">
					<Menu collections={this.props.collections}/>
					<div className="App-content">
						<Switch>
							<Route exact path="/" component={Home}/>
							<Route exact path="/schema" component={Schema}/>
							<Route exact path="/object/:type" component={ObjectComponent}/>
							<Route path="/object/:type/:id" component={ObjectComponent}/>
							<Route component={NoMatch}/>
						</Switch>
					</div>
				</div>
			</div>
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
		loadSchema: () => Promise.all([
			dispatch(loadSchema())
		]),
		loadCollections: schema => Promise.all([
			dispatch(loadCollection(schema.data.filter(field => field !== 'Schema')))
		])
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
