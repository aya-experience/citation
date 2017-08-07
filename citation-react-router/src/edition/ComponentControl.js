import React, { Component } from 'react';
import { object, element } from 'prop-types';

export const colors = [
	'rgb(122, 163, 229)',
	'rgb(158, 213, 107)',
	'rgb(103, 215, 196)',
	'rgb(235, 217, 95)',
	'rgb(239, 166, 112)',
	'rgb(230, 135, 130)',
	'rgb(152, 142, 227)',
	'rgb(224, 150, 233)'
];

let colorPointer = 0;

const stylesFn = color => ({
	container: {
		border: `3px solid ${color}`,
		position: 'relative',
		padding: '25px 5px 5px 5px'
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		color: 'white',
		backgroundColor: color,
		paddingBottom: '2px'
	}
});

export default class ComponentControl extends Component {
	static propTypes = {
		content: object.isRequired,
		children: element.isRequired
	};

	constructor() {
		super();
		const colorIndex = colorPointer;
		colorPointer = (colorPointer + 1) % colors.length;
		this.state = { color: colors[colorIndex] };
	}

	render() {
		const styles = stylesFn(this.state.color);
		return (
			<div style={styles.container}>
				<div style={styles.header}>
					{this.props.content.type}
				</div>
				{this.props.children}
			</div>
		);
	}
}
