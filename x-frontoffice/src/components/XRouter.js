import React, {Component} from 'react';
import {Match} from 'react-router';
import Page from './Page';

class XRouter extends Component {
	constructor() {
		super();
		this.state = {children: []};
	}

	componentDidMount() {
		setTimeout(() => {
			console.log('XRouter setState');
			this.setState({children: ['toto', 'titi']});
		}, 1000);
	}

	render() {
		console.log('XRouter render', this.state.children);
		return (
			<div>
				{this.state.children.map((child, i) => {
					return <Match key={i} pattern={`/${child}`} component={Page}/>;
				})}
			</div>
		);
	}
}

export default XRouter;
