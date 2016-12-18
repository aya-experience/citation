import React, {Component, PropTypes} from 'react';
import {Match} from 'react-router';
import XQueries from './XQueries';
import Default from './Default';

class XRoutes extends Component {
	static propTypes = {
		serverUrl: PropTypes.string.isRequired,
		components: PropTypes.object.isRequired,
		pages: PropTypes.array.isRequired,
		location: PropTypes.object.isRequired
	}

	constructor() {
		super();
		this.state = {trees: {}};
		this.matchRenderer = this.matchRenderer.bind(this);
	}

	loadPath(pathname, pages) {
		const tree = this.state.trees[pathname];
		const page = pages.filter(page => pathname === `/${page.slug}`)[0];
		if (tree === undefined && page !== undefined) {
			this.setState({trees: {[pathname]: null}});
			XQueries.queryComponentTree(this.props.serverUrl, page.component).then(response => {
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
		return this.createElement(tree);
	}

	render() {
		return (
			<div>
				{this.props.pages.map((page, i) => (
					<Match key={i} pattern={`/${page.slug}`} render={this.matchRenderer}/>
				))}
			</div>
		);
	}
}

export default XRoutes;
