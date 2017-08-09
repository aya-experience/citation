/* eslint new-cap: "off" */

import React, { Component } from 'react';
import { object, node } from 'prop-types';
import { SortableElement, SortableHandle } from 'react-sortable-hoc';

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

const stylesFn = color => ({
	container: {
		border: `3px solid ${color}`,
		position: 'relative',
		padding: '25px 5px 5px 5px',
		backgroundColor: 'white'
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		color: 'white',
		backgroundColor: color,
		paddingBottom: '2px'
	},
	drag: {
		float: 'left',
		margin: '0 5px',
		cursor: 'pointer'
	},
	edit: {
		float: 'right',
		margin: '0 5px',
		cursor: 'pointer'
	},
	delete: {
		float: 'right',
		margin: '0 5px',
		cursor: 'pointer'
	}
});

const DragHandle = SortableHandle(() => <a style={stylesFn().drag}>drag</a>);

class ComponentControl extends Component {
	static propTypes = {
		content: object.isRequired,
		children: node.isRequired
	};

	constructor() {
		super();

		this.handleEdit = this.handleEdit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleEdit(event) {
		window.parent.postMessage(
			{
				type: 'EDIT',
				content: this.props.content,
				position: { x: event.pageX, y: event.pageY }
			},
			'*'
		);
		event.stopPropagation();
	}

	handleDelete() {
		window.parent.postMessage({ type: 'DELETE', content: this.props.content }, '*');
	}

	render() {
		const styles = stylesFn(this.props.content.__color__);
		return (
			<div style={styles.container}>
				<div style={styles.header}>
					<DragHandle />
					{this.props.content.type}
					<a style={styles.delete} onClick={this.handleDelete}>
						delete
					</a>
					<a style={styles.edit} onClick={this.handleEdit}>
						edit
					</a>
				</div>
				{this.props.children}
			</div>
		);
	}
}

export default SortableElement(ComponentControl);
export const NotSortableControl = ComponentControl;
