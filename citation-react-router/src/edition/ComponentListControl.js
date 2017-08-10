import React, { Component } from 'react';
import { node, object } from 'prop-types';
import { SortableContainer } from 'react-sortable-hoc';

const styles = {
	lastElement: {
		border: 'solid 3px black',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	}
};

class ComponentListControl extends Component {
	static propTypes = {
		content: object,
		children: node.isRequired
	};

	constructor() {
		super();

		this.handleAdd = this.handleAdd.bind(this);
	}

	handleAdd(event) {
		window.parent.postMessage(
			{
				type: 'ADD_CHILD',
				content: this.props.content,
				position: event.pageY
			},
			'*'
		);
	}

	render() {
		return (
			<div>
				{this.props.children}
				<div style={styles.lastElement}>
					<div onClick={this.handleAdd}>Add an element</div>
				</div>
			</div>
		);
	}
}

// eslint-disable-next-line new-cap
export default SortableContainer(ComponentListControl);
