import React, {Component} from 'react';
import XRouter from './XRouter';

import logo from './logo.svg';
import './App.css';

import Component1 from './Component1';
import Component2 from './Component2';
import Component3 from './Component3';

const components = {Component1, Component2, Component3};

class App extends Component {
	render() {
		return (
			<div className="App">
				<div className="App-header">
					<img src={logo} className="App-logo" alt="logo"/>
					<h2>Welcome to React</h2>
				</div>
				<div className="App-intro">
					<XRouter serverUrl="http://localhost:4000/graphql" components={components}/>
				</div>
			</div>
		);
	}
}

export default App;
