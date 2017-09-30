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

	handleAdd() {
		window.parent.postMessage(
			{
				type: 'ADD_CHILD',
				content: this.props.content
			},
			'*'
		);
	}

	render() {
		return (
			<div>
				{this.props.children}
				<a style={styles.lastElement} onClick={this.handleAdd}>
					<div>Add an element</div>
				</a>
			</div>
		);
	}
}

// eslint-disable-next-line new-cap
export default SortableContainer(ComponentListControl);
