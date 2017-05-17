import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Field, FieldArray} from 'redux-form';
import SchemaFields from './SchemaFields';

class Fields extends Component {
	static propTypes = {
		fields: PropTypes.object.isRequired,
		meta: PropTypes.object.isRequired,
		schema: PropTypes.object.isRequired
	};

	constructor() {
		super();
		this.handleAdd = this.handleAdd.bind(this);
	}

	handleAdd() {
		const usedNames = this.props.fields.getAll().map(field => {
			return field.__name__;
		});
		let index = 1;
		let name;
		do {
			name = `newType${index}`;
			index++;
		} while (usedNames.indexOf(name) > -1);
		const newType = [{
			kind: 'SCALAR',
			name: 'new1',
			typeName: 'String'
		}];
		newType.__name__ = name;
		this.props.fields.push(newType);
	}

	handleRemove(index) {
		return () => this.props.fields.remove(index);
	}

	render() {
		return (
			<ul className="SchemaArray">
				{this.props.fields.map((link, i) => {
					return (
						<li key={i}>
							<Field component="input" type="text" name={`${link}.__name__`}/>
							<div key={i}>
								<FieldArray name={link} component={SchemaFields} props={{name: link, collections: this.props.schema}}/>
							</div>
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
