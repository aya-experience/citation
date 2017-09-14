import styled from 'styled-components';

import { lightGray } from '../style/colors';
import { ButtonContainer } from '../common/Button';

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
		height: 4rem;
	}

	textarea {
		height: 8rem;
	}

	select {
		border-left: 0.5rem solid ${lightGray};
		border-right: 0.5rem solid ${lightGray};
	}
`;

export const FieldArrayContainer = styled.div`
	display: flex;
	flex-direction: column;
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

	${ButtonContainer} {
		margin: 0.5rem 0 0 0.5rem;
	}
`;

export const ControlLine = styled.div`
	display: flex;
	flex-direction: row;
	margin-top: 1rem;
	justify-content: center;
`;

export const ActionContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	margin-top: 4rem;
`;
