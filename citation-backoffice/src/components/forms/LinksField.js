import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Field} from 'redux-form';
import LinkField from './LinkField';

export function toLinksInput(links, type) {
	return {
		__role__: 'links',
		links: links.map(link => ({
			collection: link.__type__ ? link.__type__ : type,
			id: link.__id__
		}))
	};
}

class LinksField extends Component {
	static propTypes = {
		fields: PropTypes.object.isRequired,
		meta: PropTypes.object.isRequired,
		collections: PropTypes.object.isRequired,
		type: PropTypes.string
	}

	constructor() {
		super();
		this.handleAdd = this.handleAdd.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleAdd() {
		const keys = Object.keys(this.props.collections);
		this.props.fields.push({
			__type__: keys[0],
			__id__: this.props.collections[keys[0]][0].__id__
		});
	}

	handleRemove(index) {
		return () => this.props.fields.remove(index);
	}

	render() {
		return (
			<ul className="ObjectArray">
				{this.props.fields.map((link, i) =>
					<li key={i}>
						<Field name={link} component={LinkField} props={{collections: this.props.collections, type: this.props.type}}/>
						<button type="button" onClick={this.handleRemove(i)}>
							X
						</button>
					</li>
				)}
				<li className="ObjectArrayAdd">
					<button type="button" onClick={this.handleAdd}>+</button>
				</li>
				{this.props.meta.error && <li className="error">{this.props.meta.error}</li>}
			</ul>
		);
	}
}

export default LinksField;
