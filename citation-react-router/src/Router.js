import React, {Component, PropTypes} from 'react';
import {Route} from 'react-router';
import queries from './queries';
import Routes from './Routes';

export default class Router extends Component {
	static propTypes = {
		serverUrl: PropTypes.string.isRequired,
		components: PropTypes.object.isRequired // eslint-disable-line react/no-unused-prop-types
	}

	constructor() {
		super();
		this.matchRenderer = this.matchRenderer.bind(this);

		this.state = {pages: []};
		if (window && window.__pages__) {
			this.state = {pages: window.__pages__};
		}
	}

	async componentDidMount() {
		if (this.state.pages.length === 0) {
			const pages = await queries.queryPages(this.props.serverUrl);
			this.setState({pages});
		}
	}

	matchRenderer(matchProps) {
		return <Routes pattern="/" {...matchProps} {...this.props} pages={this.state.pages}/>;
	}

	render() {
		return <Route path="/" render={this.matchRenderer}/>;
	}
}
