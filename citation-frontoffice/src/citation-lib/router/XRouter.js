import React, {Component, PropTypes} from 'react';
import {Match} from 'react-router';
import XQueries from './XQueries';
import XRoutes from './XRoutes';

class XRouter extends Component {
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
			const pages = await XQueries.queryPages(this.props.serverUrl);
			this.setState({pages});
		}
	}

	matchRenderer(matchProps) {
		return <XRoutes {...matchProps} {...this.props} pages={this.state.pages}/>;
	}

	render() {
		return <Match pattern="/" render={this.matchRenderer}/>;
	}
}

export default XRouter;
