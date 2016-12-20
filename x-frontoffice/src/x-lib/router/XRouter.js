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
		this.state = {pages: []};
		this.matchRenderer = this.matchRenderer.bind(this);
	}

	async componentDidMount() {
		const pages = await XQueries.queryPages(this.props.serverUrl);
		this.setState({pages});
	}

	matchRenderer(matchProps) {
		return <XRoutes {...matchProps} {...this.props} pages={this.state.pages}/>;
	}

	render() {
		return <Match pattern="/" render={this.matchRenderer}/>;
	}
}

export default XRouter;
