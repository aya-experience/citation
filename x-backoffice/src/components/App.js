import React, {Component, PropTypes} from 'react';
import {Match, Miss, Link} from 'react-router';
import {connect} from 'react-redux';
import logo from './logo.svg';
import {mapStateToProps, mapDispatchToProps} from '../logic/collections/collections';
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
		return this.props.load('pages');
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
						<Match exactly pattern="/" component={Home}/>
						<Match pattern="/object/:slug" component={ObjectComponent}/>
						<Miss component={NoMatch}/>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
