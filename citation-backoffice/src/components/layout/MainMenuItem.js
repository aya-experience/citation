import { omit } from 'lodash';
import React from 'react';
import { string, func } from 'prop-types';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { gray } from '../style/colors';

const InnerLink = props => <NavLink {...omit(props, 'linkRef')} innerRef={props.linkRef} />;

InnerLink.propTypes = {
	linkRef: func
};

const MainMenuItemContainer = styled(InnerLink)`
	&::before {
		content: '';
		width: 1.4rem;
		height: 1.4rem;
		background-color: ${({ color }) => color};
		position: absolute;
		border-radius: 50%;
		left: 2rem;
	}

	display: block;
	position: relative;
	font-size: 1.2rem;
	padding: .2rem 2.5rem .2rem 4.5rem;
	text-transform: uppercase;
	text-decoration: none;
	color: ${({ color }) => color};
	border-left: .1rem solid ${gray};

	&:last-child {
		border-right: .1rem solid ${gray};
	}
`;

const MainMenuItem = ({ to, title, color, isActive, innerRef }) =>
	<MainMenuItemContainer to={to} color={color} isActive={isActive} linkRef={innerRef}>
		{title}
	</MainMenuItemContainer>;

MainMenuItem.propTypes = {
	to: string.isRequired,
	title: string.isRequired,
	color: string.isRequired,
	innerRef: func,
	isActive: func
};

export default MainMenuItem;
