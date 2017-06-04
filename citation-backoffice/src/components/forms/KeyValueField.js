import {fromPairs} from 'lodash';
import React from 'react';
import {object, func} from 'prop-types';
import {Field} from 'redux-form';
import {withHandlers, compose} from 'recompose';

import ValueOrListField from './ValueOrListField';

export const toKeyValueInput = pairs => {
	return {
		__role__: 'map',
		map: fromPairs(pairs.map(pair => [
			pair.__key__,
			pair.__value__ === null ?
				pair.__list__.map(link => ({collection: link.__type__, id: link.__id__})) :
				{collection: pair.__value__.__type__, id: pair.__value__.__id__}
		]))
	};
};

const enhancer = compose(
	withHandlers({
		handleAdd: props => () => {
			props.fields.push({
				__key__: '',
				__value__: null,
				__list__: null
			});
		},
		handleRemove: props => index => () => {
			props.fields.remove(index);
		}
	})
);

const KeyValueField = ({collections, fields, meta, handleAdd, handleRemove}) => (
	<ul className="ObjectArray">
		{fields.map((link, i) =>
			<li key={i} className="ValueOrListField">
				<Field name={link} component={ValueOrListField} props={{collections}}/>
				<button type="button" onClick={handleRemove(i)}>X</button>
			</li>
		)}
		<li className="ObjectArrayAdd">
			<button type="button" onClick={handleAdd}>+</button>
		</li>
		{meta.error && <li className="error">{meta.error}</li>}
	</ul>
);

KeyValueField.propTypes = {
	handleAdd: func.isRequired,
	handleRemove: func.isRequired,
	fields: object.isRequired,
	meta: object.isRequired,
	collections: object.isRequired
};

export default enhancer(KeyValueField);
