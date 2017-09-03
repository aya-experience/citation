/* eslint-disable no-use-before-define */

import React from 'react';
import styled from 'styled-components';

import { yellow, green, darkBlue } from '../style/colors';
import MainMenuItem from './MainMenuItem';
import MainMenuIndicator from './MainMenuIndicator';

const MainMenuContainer = styled.nav`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: center;
`;

const refNode = index => node => {
	items[index].node = node;
};

const isActive = index => match => {
	items[index].match = match;
	return match;
};

const items = [
	{
		menu: (
			<MainMenuItem
				key="structure"
				isActive={isActive(0)}
				innerRef={refNode(0)}
				to="/sitemap"
				title="Structure"
				color={yellow}
			/>
		),
		node: null,
		match: null
	},
	{
		menu: (
			<MainMenuItem key="model" isActive={isActive(1)} innerRef={refNode(1)} to="/model" title="Model" color={green} />
		),
		node: null,
		match: null
	},
	{
		menu: (
			<MainMenuItem
				key="content"
				isActive={isActive(2)}
				innerRef={refNode(2)}
				to="/"
				title="Content"
				color={darkBlue}
			/>
		),
		node: null,
		match: null
	}
];

const MainMenu = () =>
	<MainMenuContainer>
		{items.map(item => item.menu)}
		<MainMenuIndicator items={items} />
	</MainMenuContainer>;

export default MainMenu;
