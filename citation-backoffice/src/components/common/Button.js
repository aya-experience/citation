import { omit } from 'lodash';
import React from 'react';
import { string, oneOf } from 'prop-types';
import ReactSvg from 'react-svg';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { green } from '../style/colors';

const sizes = {
	big: 4,
	medium: 3,
	small: 2
};

export const ButtonContainer = styled.button`
	height: ${({ size }) => sizes[size]}rem;
	width: ${({ size }) => sizes[size]}rem;
	display: inline-block;
	border: .1rem solid ${({ color }) => color};
	border-radius: 50%;
	margin: 0 .5rem .5rem .5rem;
	padding: ${({ size }) => sizes[size] / 4 - 0.1}rem; /* - 0.1r	em for the border */
	cursor: pointer;
	background-color: transparent;
	transition: .5s color, background-color ease;

	svg {
		fill: ${({ color }) => color};
		transition: .5s fill, color, background-color ease;
	}

	&:hover {
		background-color: ${({ color }) => color};

		svg {
			fill: white;
		}
	}
`;

export const ButtonLinkContainer = ButtonContainer.withComponent(Link);

const Svg = styled(ReactSvg)`
	height: ${({ size }) => sizes[size] / 2}rem;
	width: ${({ size }) => sizes[size] / 2}rem;
	display: block;
`;

// eslint-disable-next-line no-use-before-define
const omitProps = props => omit(props, Object.keys(Button.propTypes));

export const Button = props =>
	<ButtonContainer {...omitProps(props)} type={props.type} color={props.color} size={props.size}>
		<Svg path={`/assets/icons/${props.icon}.svg`} color={props.color} size={props.size} />
	</ButtonContainer>;

export const ButtonLink = props =>
	<ButtonLinkContainer {...omitProps(props)} color={props.color} type={props.type} size={props.size}>
		<Svg path={`/assets/icons/${props.icon}.svg`} color={props.color} size={props.size} />
	</ButtonLinkContainer>;

Button.propTypes = {
	icon: string.isRequired,
	type: string,
	color: string,
	size: oneOf(['big', 'medium', 'small'])
};

ButtonLink.propTypes = Button.propTypes;

Button.defaultProps = {
	type: 'button',
	color: green,
	size: 'medium'
};

ButtonLink.defaultProps = Button.defaultProps;

export default Button;
