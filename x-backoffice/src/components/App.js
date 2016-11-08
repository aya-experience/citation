import React, {Component, PropTypes} from 'react';
import {Match, Miss} from 'react-router';
import {connect} from 'react-redux';
import logo from './logo.svg';
import {mapStateToProps, mapDispatchToProps} from '../logic/collections/collections';

import './App.css';

const Home = () => <div>Home</div>;
const About = () => <div>About</div>;
const NoMatch = () => <div>NoMatch</div>;

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
					<img src={logo} className="App-logo" alt="logo"/>
					<h2>X CMS Admin</h2>
				</div>
				<div className="App-layout">
					<div className="App-menu">
						Menu {JSON.stringify(this.props.collections)}
					</div>
					<div className="App-content">
						<Match exactly pattern="/" component={Home}/>
						<Match pattern="/about" component={About}/>
						<Miss component={NoMatch}/>
					</div>
				</div>
			</div>
		);
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
