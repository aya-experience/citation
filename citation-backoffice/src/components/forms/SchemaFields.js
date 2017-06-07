import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import { Field } from 'redux-form';
import FieldType from './FieldType';

class Fields extends Component {
	static propTypes = {
		fields: PropTypes.object.isRequired,
		meta: PropTypes.object.isRequired,
		collections: PropTypes.object.isRequired,
		name: PropTypes.string.isRequired
	};

	constructor() {
		super();
		this.handleAdd = this.handleAdd.bind(this);
	}

	handleAdd() {
		const usedNames = this.props.fields.getAll().map(field => {
			return field.name;
		});
		let index = 1;
		let name;
		do {
			name = `new${index}`;
			index++;
		} while (usedNames.indexOf(name) > -1);
		this.props.fields.push({
			name,
			typeName: 'String',
			kind: 'SCALAR'
		});
	}

	handleRemove(index) {
		return () => this.props.fields.remove(index);
	}

	render() {
		const key = this.props.name;
		return (
			<ul className="SchemaArray">
				{this.props.fields.map((link, i) => {
					const inputName = `${key}.__fields__[${i}].name`;
					const kindName = `${key}.__fields__[${i}].kind`;
					const typeName = `${key}.__fields__[${i}].typeName`;
					return (
						<li key={i}>
							<Field component="input" type="text" name={inputName} />
							<Field
								name={kindName}
								component={FieldType}
								props={{
									kindName,
									typeName,
									collections: this.props.collections
								}}
							/>
							<button type="button" onClick={this.handleRemove(i)}>
								X
							</button>
						</li>
					);
				})}
				<li className="SchemaArrayAdd">
					<button type="button" onClick={this.handleAdd}>+</button>
				</li>
				{this.props.meta.error && <li className="error">{this.props.meta.error}</li>}
			</ul>
		);
	}
}

export default Fields;
