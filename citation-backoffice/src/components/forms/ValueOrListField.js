import {isArray} from 'lodash';
import React from 'react';
import {object, bool, func} from 'prop-types';
import {Field, FieldArray} from 'redux-form';
import {withState, withHandlers, compose} from 'recompose';

import LinkField from './LinkField';
import LinksField from './LinksField';

const enhancer = compose(
	withState('isArray', 'toggle', ({input}) => isArray(input.value.__list__)),
	withHandlers({
		handleToggle: props => () => props.toggle(!props.isArray)
	})
);

const ValueOrListField = ({input, collections, isArray, handleToggle}) => (
	<div>
		<div>
			<Field name={`${input.name}.__key__`} component="input"/>
			<label htmlFor={`isArray-${input.name}`}>Array</label>
			<input type="checkbox" value={isArray} onClick={handleToggle}/>
		</div>
		{
			isArray ?
				<FieldArray name={`${input.name}.__list__`} component={LinksField} props={{collections}}/> :
				<Field name={`${input.name}.__value__`} component={LinkField} props={{collections}}/>
		}
	</div>
);

ValueOrListField.propTypes = {
	input: object.isRequired,
	isArray: bool.isRequired,
	handleToggle: func.isRequired,
	collections: object.isRequired
};

export default enhancer(ValueOrListField);
