import React, {Component, PropTypes} from 'react';

class Page extends Component {
	static propTypes = {
		title: PropTypes.string.isRequired,
		content: PropTypes.string.isRequired
	};

	render() {
		return (
			<div className="Page">
				<h1 className="Page-title">
					Page Title: {this.props.title}
				</h1>
				<p className="Page-content">
					{this.props.content}
				</p>
			</div>
		);
	}
}

export default Page;
