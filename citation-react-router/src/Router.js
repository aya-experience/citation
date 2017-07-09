import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { queryPages, buildPageTree } from './queries';
import Routes from './Routes';

export default class Router extends Component {
	static propTypes = {
		serverUrl: string.isRequired,
		components: object.isRequired // eslint-disable-line react/no-unused-prop-types
	};

	constructor() {
		super();

		this.state = { pages: [] };
		if (window && window.__pages__) {
			this.state = { pages: window.__pages__ };
		}
	}

	async componentDidMount() {
		if (this.state.pages.length === 0) {
			const pages = await queryPages(this.props.serverUrl).then(buildPageTree);
			this.setState({ pages });
		}
	}

	render() {
		return (
			<div>
				<Routes match={{ url: '' }} {...this.props} pages={this.state.pages} />
				<Routes match={{ url: '/preview' }} {...this.props} pages={this.state.pages} />
			</div>
		);
	}
}
