import styled from 'styled-components';

import { lightGray } from '../style/colors';

export const Form = styled.form`
	display: flex;
	flex-direction: column;
	margin: 0 auto;
	width: 80rem;
	font-size: 1.5rem;
`;

export const FieldContainer = styled.div`
	display: flex;
	flex-direction: column;

	input,
	textarea,
	select,
	option {
		padding: 1rem 1.5rem;
		line-height: 2rem;
		font-size: 1.5rem;
		background-color: ${lightGray};
		border: none;
		width: 100%;
	}

	textarea {
		height: 8rem;
	}

	select {
		height: 4rem;
		border-left: .5rem solid ${lightGray};
		border-right: .5rem solid ${lightGray};
	}
`;

export const Label = styled.label`
	font-size: 1.8rem;
	padding: 2rem 1.5rem 1rem 1.5rem;
`;

export const InputLine = styled.div`
	display: flex;
	flex-direction: row;
	margin-top: 1rem;

	&:first-of-type {
		margin-top: 0;
	}
`;

export const ControlLine = InputLine.extend`
	margin-top: 1rem;
	justify-content: center;
`;

export const ActionContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-top: 4rem;
`;
