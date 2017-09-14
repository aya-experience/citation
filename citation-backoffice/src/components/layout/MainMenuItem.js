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
		width: 1.6rem;
		height: 1.6rem;
		background-color: ${({ color }) => color};
		position: absolute;
		border-radius: 50%;
		top: 0.8rem;
		left: 3rem;
	}

	display: block;
	position: relative;
	font-size: 1.8rem;
	padding: 0.4rem 4rem 0.4rem 6rem;
	text-transform: uppercase;
	text-decoration: none;
	color: ${({ color }) => color};
	border-left: 0.2rem solid ${gray};

	&:last-child {
		border-right: 0.2rem solid ${gray};
	}
`;

const MainMenuItem = ({ to, title, color, isActive, innerRef }) => (
	<MainMenuItemContainer to={to} color={color} isActive={isActive} linkRef={innerRef}>
		{title}
	</MainMenuItemContainer>
);

MainMenuItem.propTypes = {
	to: string.isRequired,
	title: string.isRequired,
	color: string.isRequired,
	innerRef: func,
	isActive: func
};

export default MainMenuItem;
