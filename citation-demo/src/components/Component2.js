import React, {Component, PropTypes} from 'react';

export default class Component2 extends Component {
	static propTypes = {
		children: PropTypes.array,
		data: PropTypes.array
	};

	render() {
		return (
			<div className="Component2">
				<h1 className="Component2-title">
					Component2 Title: {this.props.data[0].title}
				</h1>
				<p className="Component2-content">
					{this.props.data[0].content}
				</p>
				<div className="Component2-children">
					{this.props.children}
				</div>
			</div>
		);
	}
}
