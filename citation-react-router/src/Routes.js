import React, { Component, PropTypes } from 'react';
import { Route } from 'react-router-dom';
import queries from './queries';
import Default from './Default';

export default class Routes extends Component {
	static propTypes = {
		serverUrl: PropTypes.string.isRequired,
		components: PropTypes.object.isRequired,
		pages: PropTypes.array.isRequired,
		match: PropTypes.object.isRequired
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
			const content = await queries.queryComponentTree(this.props.serverUrl, page.component);
			this.setState({ contents: { [page.component.__id__]: content } });
		}
	}

	createElement(page, { type, data, props, children = [] }, i, matchProps) {
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
				const value = prop.__value__.__value__ ? prop.__value__.__value__ : prop.__value__;
				parsedProps[prop.__key__] = value;
			});
		}
		return (
			<Component {...parsedProps} key={i} data={data} pages={this.props.pages} childPage={childPage}>
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
			<div>
				{this.props.pages.map((page, i) => {
					const path = `${this.props.match.url}/${page.slug}`.replace(/\/\//g, '/');
					return <Route key={i} path={path} render={this.matchRenderer(page)} />;
				})}
			</div>
		);
	}
}
