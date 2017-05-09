import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Field} from 'redux-form';
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
		this.props.fields.push({
			name: 'new',
			typeName: 'String',
			kind: 'SCALAR'
		});
	}

	render() {
		console.log(this.props.fields);
		console.log(this.props.collections);
		const key = this.props.name;
		return (
			<ul className="SchemaArray">
				{this.props.fields.map((link, i) => {
					const inputName = `${key}[${i}].name`;
					const kindName = `${key}[${i}].kind`;
					const typeName = `${key}[${i}].typeName`;
					return (<li key={i}>
						<Field component="input" type="text" name={inputName}/>
						<Field name={kindName} component={FieldType} props={{kindName, typeName, collections: this.props.collections}}/>
					</li>);
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
