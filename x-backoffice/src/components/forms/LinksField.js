import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Field} from 'redux-form';
import LinkField from './LinkField';

class LinksField extends Component {
	static propTypes = {
		fields: PropTypes.object.isRequired,
		meta: PropTypes.object.isRequired,
		values: PropTypes.array.isRequired
	}

	constructor() {
		super();
		this.handleAdd = this.handleAdd.bind(this);
		this.handleRemove = this.handleRemove.bind(this);
	}

	handleAdd() {
		this.props.fields.push(this.props.values[0]);
	}

	handleRemove(index) {
		return () => this.props.fields.remove(index);
	}

	render() {
		return (
			<ul className="ObjectArray">
				{this.props.fields.map((link, i) =>
					<li key={i}>
						<Field name={link} component={LinkField} props={{values: this.props.values}}/>
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
