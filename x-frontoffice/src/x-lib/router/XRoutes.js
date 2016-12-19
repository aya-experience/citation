import React, {Component, PropTypes} from 'react';
import {Match} from 'react-router';
import XQueries from './XQueries';
import Default from './Default';

class XRoutes extends Component {
	static propTypes = {
		serverUrl: PropTypes.string.isRequired,
		components: PropTypes.object.isRequired,
		pages: PropTypes.array.isRequired
	}

	constructor() {
		super();
		this.state = {trees: {}};
		this.matchRenderer = this.matchRenderer.bind(this);
	}

	loadPath(pattern) {
		const tree = this.state.trees[pattern];
		const page = this.props.pages.filter(page => pattern === page.slug)[0];
		if (tree === undefined && page !== undefined) {
			Promise.resolve().then(() => {
				this.setState({trees: {[pattern]: null}});
				XQueries.queryComponentTree(this.props.serverUrl, page.component).then(response => {
					this.setState({trees: {[pattern]: response.Component[0]}});
				});
			});
		}
	}

	createElement(page, {type, data, children = []}, matchProps) {
		let component = this.props.components[type];
		if (component === undefined) {
			component = Default;
		}
		let childPage;
		if (Array.isArray(page.children)) {
			childPage = <XRoutes {...this.props} {...matchProps} pages={page.children}/>;
		}
		return React.createElement(
			component,
			{data, childPage},
			...children.map(child => this.createElement(page, child, matchProps))
		);
	}

	matchRenderer(matchProps) {
		const tree = this.state.trees[matchProps.pattern];
		const page = this.props.pages.filter(page => matchProps.pattern === page.slug)[0];
		if (tree === undefined || tree === null) {
			this.loadPath(matchProps.pattern);
			return <span/>;
		}
		return this.createElement(page, tree, matchProps);
	}

	render() {
		return (
			<div>
				{this.props.pages.map((page, i) => (
					<Match key={i} pattern={page.slug} render={this.matchRenderer}/>
				))}
			</div>
		);
	}
}

export default XRoutes;
