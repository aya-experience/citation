import React, {Component, PropTypes} from 'react';
import {Route} from 'react-router';
import queries from './queries';
import Default from './Default';

export default class Routes extends Component {
	static propTypes = {
		serverUrl: PropTypes.string.isRequired,
		components: PropTypes.object.isRequired,
		pages: PropTypes.array.isRequired,
		pattern: PropTypes.string.isRequired
	}

	constructor() {
		super();
		this.matchRenderer = this.matchRenderer.bind(this);
		this.state = {contents: {}};
	}

	componentWillMount() {
		if (window && window.__contents__) {
			this.setState({contents: window.__contents__[this.props.pattern]});
		}
	}

	async loadPathContent(pattern) {
		const content = this.state.contents[pattern];
		const page = this.props.pages.filter(page => pattern === page.slug)[0];
		if (content === undefined && page !== undefined) {
			await Promise.resolve();
			this.setState({contents: {[pattern]: null}});
			const content = await queries.queryComponentTree(this.props.serverUrl, page.component);
			this.setState({contents: {[pattern]: content}});
		}
	}

	createElement(page, {type, data, children = []}, i, matchProps) {
		let Component = this.props.components[type];

		if (Component === undefined) {
			Component = Default;
		}
		let childPage;
		if (Array.isArray(page.children)) {
			childPage = <Routes pattern={page.slug} {...this.props} {...matchProps} pages={page.children}/>;
		}
		return (
			<Component key={i} data={data} pages={this.props.pages} childPage={childPage}>
				{children.map((child, i) => this.createElement(page, child, i, matchProps))}
			</Component>
		);
	}

	matchRenderer(pattern) {
		return matchProps => {
			const content = this.state.contents[pattern];
			const page = this.props.pages.filter(page => pattern === page.slug)[0];
			if (content === undefined || content === null) {
				this.loadPathContent(pattern);
				return <span/>;
			}
			return this.createElement(page, content, 0, matchProps);
		};
	}

	render() {
		return (
			<div>
				{this.props.pages.map((page, i) => (
					<Route key={i} pattern={page.slug} render={this.matchRenderer(page.slug)}/>
				))}
			</div>
		);
	}
}
