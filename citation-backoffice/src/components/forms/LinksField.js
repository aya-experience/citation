import React from 'react';
import { func, object, string } from 'prop-types';
import { Field } from 'redux-form';
import { withHandlers } from 'recompose';
import styled from 'styled-components';

import LinkField from './LinkField';
import { Button, ButtonContainer } from '../common/Button';
import { red } from '../style/colors';

const Container = styled.ul`
	list-style: none;
	margin: 0;
	padding: 0;
`;

const Line = styled.li`
	display: flex;
	flex-direction: row;
	margin: 1rem 0;

	> div:first-child {
		width: calc(100% - 12rem);
	}

	${ButtonContainer} {
		margin: .5rem 0 0 .5rem;
	}
`;

const ControlLine = Line.extend`
	display: flex;
	flex-direction: row;
	justify-content: center;
`;

const enhancer = withHandlers({
	handleAdd: ({ fields, collections }) => () => {
		const keys = Object.keys(collections);
		fields.push({
			__type__: keys[0],
			__id__: collections[keys[0]][0].__id__
		});
	},
	handleRemove: ({ fields }) => index => () => fields.remove(index),
	handleUp: ({ fields }) => index => () => fields.swap(index, index - 1),
	handleDown: ({ fields }) => index => () => fields.swap(index, index + 1)
});

const LinksField = ({ type, fields, collections, meta, handleAdd, handleRemove, handleUp, handleDown }) =>
	<Container>
		{fields.map((link, i) =>
			<Line key={i}>
				<Field name={link} component={LinkField} props={{ collections, type }} />
				<Button icon="delete" onClick={handleRemove(i)} color={red} />
				{i > 0 && <Button icon="up" onClick={handleUp(i)} />}
				{i + 1 < fields.length && <Button icon="down" onClick={handleDown(i)} />}
			</Line>
		)}
		<ControlLine>
			<Button icon="plus" onClick={handleAdd} />
		</ControlLine>
		{meta.error &&
			<ControlLine>
				{meta.error}
			</ControlLine>}
	</Container>;

LinksField.propTypes = {
	fields: object.isRequired,
	meta: object.isRequired,
	collections: object.isRequired,
	type: string,
	handleAdd: func.isRequired,
	handleRemove: func.isRequired,
	handleUp: func.isRequired,
	handleDown: func.isRequired
};

export default enhancer(LinksField);
