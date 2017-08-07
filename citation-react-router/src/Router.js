import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { queryPages, buildPageTree } from './queries';
import Routes from './Routes';

const technicalContexts = ['/preview', '/edition'];

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
		let context = '';
		if (window && window.location) {
			const pathname = window.location.pathname;
			const matchingContexts = technicalContexts.filter(context => pathname.startsWith(context));
			if (matchingContexts.length > 0) {
				context = matchingContexts[0];
			}
		}
		return <Routes match={{ url: context }} {...this.props} context={context} pages={this.state.pages} />;
	}
}
