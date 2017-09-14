import { omit } from 'lodash';
import React from 'react';
import { string, oneOf, object, func, number } from 'prop-types';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { green } from '../style/colors';
import { Icon } from './Icon';

const sizes = {
	big: 4,
	medium: 3,
	small: 2
};

export const ButtonContainer = styled.button`
	height: ${({ size }) => sizes[size]}rem;
	width: ${({ size }) => sizes[size]}rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border: 0.1rem solid ${({ color }) => color};
	border-radius: 50%;
	margin: 0 0.5rem 0.5rem 0.5rem;
	cursor: pointer;
	background-color: transparent;
	transition: 0.5s color, background-color ease;

	svg {
		fill: ${({ color }) => color};
		transition: 0.5s fill, color, background-color ease;
	}

	&:hover {
		background-color: ${({ color }) => color};

		svg {
			fill: white;
		}
	}
`;

export const ButtonLinkContainer = ButtonContainer.withComponent(Link);

export const ButtonSvgContainer = styled.g`
	cursor: pointer;

	& > circle {
		fill: white;
		stroke: ${({ color }) => color};
		stroke-width: 0.1px;
	}

	svg {
		fill: ${({ color }) => color};
		transition: 0.5s fill, color, background-color ease;
	}

	&:hover {
		& > circle {
			fill: ${({ color }) => color};
		}

		svg {
			fill: white;
		}
	}
`;

// eslint-disable-next-line no-use-before-define
const omitProps = props => omit(props, Object.keys(Button.propTypes));

export const Button = props => (
	<ButtonContainer {...omitProps(props)} type={props.type} color={props.color} size={props.size}>
		<Icon icon={props.icon} size={`${sizes[props.size] / 2}rem`} />
	</ButtonContainer>
);

export const ButtonLink = props => (
	<ButtonLinkContainer {...omitProps(props)} type={props.type} color={props.color} size={props.size}>
		<Icon icon={props.icon} size={`${sizes[props.size] / 2}rem`} />
	</ButtonLinkContainer>
);

export const ButtonSvg = ({ icon, color, position, onClick, size }) => (
	<ButtonSvgContainer onClick={onClick} color={color}>
		<circle cx={position.x} cy={position.y} r={size / 2} />
		<Icon
			icon={icon}
			position={{
				x: position.x - size / 2 + size * 0.2,
				y: position.y - size / 2 + size * 0.2
			}}
			size={`${size * 0.6}px`}
		/>
	</ButtonSvgContainer>
);

Button.propTypes = {
	icon: string.isRequired,
	type: string,
	color: string,
	size: oneOf(['big', 'medium', 'small'])
};

ButtonLink.propTypes = Button.propTypes;

ButtonSvg.propTypes = {
	...Button.propTypes,
	position: object.isRequired,
	size: number.isRequired,
	onClick: func.isRequired
};

Button.defaultProps = {
	type: 'button',
	color: green,
	size: 'medium'
};

ButtonLink.defaultProps = Button.defaultProps;
ButtonSvg.defaultProps = Button.defaultProps;

export default Button;
