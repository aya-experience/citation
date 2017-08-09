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

		let pages = [];
		if (window && window.__pages__) {
			pages = window.__pages__;
		}
		this.state = { pages, context: this.getContext(), key: 0 };
	}

	getContext() {
		let context = '';
		if (window && window.location) {
			const pathname = window.location.pathname;
			const matchingContexts = technicalContexts.filter(context => pathname.startsWith(context));
			if (matchingContexts.length > 0) {
				context = matchingContexts[0];
			}
		}
		return context;
	}

	async componentDidMount() {
		if (this.state.pages.length === 0) {
			const pages = await queryPages(this.props.serverUrl).then(buildPageTree);
			this.setState({ pages });
		}
		if (this.state.context === '/edition') {
			window.addEventListener('message', event => {
				if (event.source === window.parent) {
					if (event.data.type === 'RELOAD') {
						window.location.reload();
					}
				}
			});
		}
	}

	render() {
		const { context, pages } = this.state;
		return <Routes match={{ url: context }} {...this.props} context={context} pages={pages} />;
	}
}
