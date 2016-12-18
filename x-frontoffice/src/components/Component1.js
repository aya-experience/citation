import React, {Component, PropTypes} from 'react';

class Component1 extends Component {
	static propTypes = {
		children: PropTypes.array,
		data: PropTypes.array
	};

	render() {
		return (
			<div className="Component1">
				<h1 className="Component1-title">
					Component1 Title: {this.props.data[0].title}
				</h1>
				<p className="Component1-content">
					{this.props.data[0].content}
				</p>
				<div className="Component1-children">
					{this.props.children}
				</div>
			</div>
		);
	}
}

export default Component1;
