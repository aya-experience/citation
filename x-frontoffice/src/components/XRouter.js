import React, {Component, PropTypes} from 'react';
import {Match} from 'react-router';
import Default from './Default';

function graphqlQuery(url, body) {
	return fetch(url, {
		method: 'POST', body,
		headers: new Headers({'Content-Type': 'application/graphql'})
	}).then(response => response.json())
		.then(response => response.data);
}

class XRouter extends Component {
	static propTypes = {
		serverUrl: PropTypes.string.isRequired,
		components: PropTypes.object.isRequired // eslint-disable-line
	}

	constructor() {
		super();
		this.state = {
			pages: []
		};
		this.matchRenderer = this.matchRenderer.bind(this);
	}

	requestPages() {
		return graphqlQuery(this.props.serverUrl, `query Query {
			Page {
				__id__, slug, component {
					__id__, __tree__
				}
			}
		}`);
	}

	componentDidMount() {
		this.requestPages().then(response => {
			console.log('XRouter setState', response);
			this.setState({pages: response.Page});
		});
	}

	matchRenderer(matchProps) {
		return <XRoutes {...matchProps} {...this.props} pages={this.state.pages}/>;
	}

	render() {
		console.log('XRouter render', this.state.pages);
		return (
			<Match pattern="/" render={this.matchRenderer}/>
		);
	}
}

class XRoutes extends Component {
	static propTypes = {
		serverUrl: PropTypes.string.isRequired,
		components: PropTypes.object.isRequired,
		pages: PropTypes.array.isRequired,
		location: PropTypes.object.isRequired
	}

	constructor() {
		super();
		this.state = {
			trees: {}
		};
		this.matchRenderer = this.matchRenderer.bind(this);
	}

	requestComponentTree(tree) {
		return graphqlQuery(this.props.serverUrl, `query Query {
			Component(id: "${tree.__id__}") {
				${tree.__tree__}
			}
		}`);
	}

	loadPath(pathname, pages) {
		const tree = this.state.trees[pathname];
		const page = pages.filter(page => pathname === `/${page.slug}`)[0];
		console.log('loadPath', pathname, tree, pages, page);
		if (tree === undefined && page !== undefined) {
			this.setState({trees: {[pathname]: null}});
			this.requestComponentTree(page.component).then(response => {
				this.setState({trees: {[pathname]: response.Component[0]}});
			});
		}
	}

	componentDidMount() {
		this.loadPath(this.props.location.pathname, this.props.pages);
	}

	componentWillReceiveProps(props) {
		this.loadPath(props.location.pathname, props.pages);
	}

	createElement({type, data, children = []}) {
		let component = this.props.components[type];
		if (component === undefined) {
			component = Default;
		}
		console.log('createElement', type, data);
		return React.createElement(
			component,
			{data},
			...children.map(child => this.createElement(child))
		);
	}

	matchRenderer(matchProps) {
		const tree = this.state.trees[matchProps.pathname];
		if (tree === undefined || tree === null) {
			return <span/>;
		}
		console.log('matchRenderer', tree);
		return this.createElement(tree);
	}

	render() {
		console.log('XRoutes render', this.props, this.state);
		return (
			<div>
				{this.props.pages.map((page, i) => (
					<Match key={i} pattern={`/${page.slug}`} render={this.matchRenderer}/>
				))}
			</div>
		);
	}
}

export default XRouter;
