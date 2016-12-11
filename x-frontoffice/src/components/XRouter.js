import React, {Component, PropTypes} from 'react';
import {Match} from 'react-router';

class XRouter extends Component {
	static propTypes = {
		serverUrl: PropTypes.string.isRequired,
		components: PropTypes.object.isRequired
	}

	constructor() {
		super();
		this.state = {pages: []};
	}

	requestPages() {
		return fetch(this.props.serverUrl, {
			method: 'POST',
			body: `query RootQueryType {
				collection(type:"pages") {
					... on Page {
						id,
						slug,
						title,
						component {
							id,
							type,
							title,
							content
						}
					}
				}
			}`,
			headers: new Headers({'Content-Type': 'application/graphql'})
		}).then(response => response.json())
			.then(response => response.data);
	}

	componentDidMount() {
		this.requestPages().then(response => {
			console.log('XRouter setState', response);
			this.setState({pages: response.collection});
		});
	}

	render() {
		console.log('XRouter render', this.state.pages);
		return (
			<div>
				{this.state.pages.map((page, i) => (
					<Match key={i} pattern={`/${page.slug}`} render={matchProps => (
						React.createElement(
							this.props.components[page.component.type],
							{...matchProps, ...page.component}
						)
					)}/>
				))}
			</div>
		);
	}
}

export default XRouter;
