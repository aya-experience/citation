import React, { Component } from 'react';
import { string, object, array } from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import { queryComponentTree } from './queries';
import Default from './Default';

export default class Routes extends Component {
	static propTypes = {
		serverUrl: string.isRequired,
		components: object.isRequired,
		pages: array.isRequired,
		match: object.isRequired
	};

	constructor() {
		super();
		this.matchRenderer = this.matchRenderer.bind(this);
		this.state = { contents: {} };
	}

	componentWillMount() {
		if (window && window.__contents__) {
			this.setState({ contents: window.__contents__ });
		}
	}

	async loadPageContent(page) {
		if (page !== undefined && this.state.contents[page.component.__id__] === undefined) {
			await Promise.resolve();
			this.setState({ contents: { [page.component.__id__]: null } });
			const content = await queryComponentTree(this.props.serverUrl, page.component);
			this.setState({ contents: { [page.component.__id__]: content } });
		}
	}

	createElement(page, { type, props, children }, i, matchProps) {
		children = children ? children : [];
		let Component = this.props.components[type];

		if (Component === undefined) {
			Component = Default;
		}
		let childPage;
		if (Array.isArray(page.children)) {
			childPage = <Routes {...this.props} {...matchProps} pages={page.children} />;
		}
		const parsedProps = {};
		if (Array.isArray(props)) {
			props.forEach(prop => {
				const value = prop.__value__ ? prop.__value__ : prop.__list__;
				parsedProps[prop.__key__] = value;
			});
		}
		return (
			<Component {...parsedProps} key={i} pages={this.props.pages} childPage={childPage}>
				{children.map((child, i) => this.createElement(page, child, i, matchProps))}
			</Component>
		);
	}

	matchRenderer(page) {
		return matchProps => {
			const content = this.state.contents[page.component.__id__];
			if (content === undefined || content === null) {
				this.loadPageContent(page);
				return <span />;
			}
			return this.createElement(page, content, 0, matchProps);
		};
	}

	render() {
		return (
			<Switch>
				{this.props.pages.reverse().map((page, i) => {
					const slug = page.slug === null ? '' : page.slug;
					const path = `${this.props.match.url}/${slug}`.replace(/\/\//g, '/');
					return <Route key={i} path={path} render={this.matchRenderer(page)} />;
				})}
			</Switch>
		);
	}
}
