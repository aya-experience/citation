import React, {Component, PropTypes} from 'react';

class Component1 extends Component {
	static propTypes = {
		children: PropTypes.array,
		data: PropTypes.array,
		childPage: PropTypes.element
	};

	render() {
		return (
			<div className="Component1">
				<h1 className="Component1-title">
					Component1 Title: {this.props.data[0].title}
				</h1>
				<p className="Component1-content">
					Component1 Content: {this.props.data[0].content}
				</p>
				<div className="Component1-children">
					Chomponent1 Children: {this.props.children}
				</div>
				<div className="Component1-childPage">
					Chomponent1 Child Page: {this.props.childPage}
				</div>
			</div>
		);
	}
}

export default Component1;
