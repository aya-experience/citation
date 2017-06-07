import React, { Component, PropTypes } from 'react';

class Default extends Component {
	static propTypes = {
		children: PropTypes.array,
		data: PropTypes.array
	};

	render() {
		return (
			<div className="Default">
				Default component with data {JSON.stringify(this.props.data)}
				{this.props.children}
			</div>
		);
	}
}

export default Default;
