import { isArray } from 'lodash';
import React from 'react';
import { object, bool, func } from 'prop-types';
import { Field, FieldArray } from 'redux-form';
import { withState, withHandlers, compose } from 'recompose';
import styled from 'styled-components';

import LinkField from './LinkField';
import LinksField from './LinksField';
import { InputLine, FieldArrayContainer } from '../common/Form';

const ValueOrListContainer = styled.div`
	flex: 1;
	display: flex;
	flex-direction: row;

	& > ${InputLine}, & > ${FieldArrayContainer} {
		flex: 3;
		margin-top: 0;

		select {
			margin-left: 1rem;
		}
	}
`;

const PropNameContainer = styled.div`
	flex: 2;
	display: flex;
	flex-direction: row;

	& > input {
		flex: 1;
	}
`;

const ArrayCheckboxContainer = styled.div`
	height: 4rem;
	margin-left: 1rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	input {
		margin: 0;
		padding: 0;
		height: 2rem;
		width: 2rem;
	}
`;

const enhancer = compose(
	withState('isArray', 'toggle', ({ input }) => isArray(input.value.__list__)),
	withHandlers({
		handleToggle: props => () => props.toggle(!props.isArray)
	})
);

const ValueOrListField = ({ input, collections, isArray, handleToggle }) =>
	<ValueOrListContainer>
		<PropNameContainer>
			<Field name={`${input.name}.__key__`} component="input" />
			<ArrayCheckboxContainer>
				<label htmlFor={`isArray-${input.name}`}>Array</label>
				<input type="checkbox" value={isArray} onClick={handleToggle} />
			</ArrayCheckboxContainer>
		</PropNameContainer>
		{isArray
			? <FieldArray name={`${input.name}.__list__`} component={LinksField} props={{ collections }} />
			: <Field name={`${input.name}.__value__`} component={LinkField} props={{ collections }} />}
	</ValueOrListContainer>;

ValueOrListField.propTypes = {
	input: object.isRequired,
	isArray: bool.isRequired,
	handleToggle: func.isRequired,
	collections: object.isRequired
};

export default enhancer(ValueOrListField);
