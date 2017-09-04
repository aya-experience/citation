import React from 'react';
import styled from 'styled-components';

import MainMenu from './MainMenu';
import A from '../common/A';

const publicUrl = process.env.PUBLIC_URL;

const HeaderContainer = styled.header`
	position: relative;
	padding: .1rem;
	height: 3rem;
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;

	img {
		height: 100%;
	}
`;

const Link = A.extend`
	font-size: 1.2rem;
	padding: .2rem;
`;

const Header = () =>
	<HeaderContainer>
		<img src={`${publicUrl}/assets/logo-citation.png`} alt="Citation" />
		<MainMenu />
		<Link href={`${publicUrl}/preview`} target="_blank">
			Preview
		</Link>
		<Link href={publicUrl} target="_blank">
			Production
		</Link>
	</HeaderContainer>;

export default Header;
