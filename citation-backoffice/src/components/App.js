import React, {Component, PropTypes} from 'react';
import {Route, Link, Switch} from 'react-router-dom';
import {connect} from 'react-redux';
import {loadCollection} from '../logic/collections';
import logo from './logo.svg';
import Menu from './Menu';
import Home from './Home';
import ObjectComponent from './Object';

import './App.css';

const NoMatch = () => <div><h1>Oups!</h1></div>;

class App extends Component {
	static propTypes = {
		collections: PropTypes.object.isRequired,
		load: PropTypes.func.isRequired
	}

	componentDidMount() {
		return this.props.load();
	}

	render() {
		return (
			<div className="App">
				<div className="App-header">
					<Link to="/">
						<img src={logo} className="App-logo" alt="logo"/>
						<h2>X CMS Admin</h2>
					</Link>
				</div>
				<div className="App-layout">
					<Menu collections={this.props.collections}/>
					<div className="App-content">
						<Switch>
							<Route exact path="/" component={Home}/>
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
		collections: state.collections
	};
};

const mapDispatchToProps = dispatch => {
	return {
		load: () => Promise.all([
			dispatch(loadCollection('Page')),
			dispatch(loadCollection('Component')),
			dispatch(loadCollection('Content'))
		])
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
