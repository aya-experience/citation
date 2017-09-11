import React from 'react';
import styled from 'styled-components';

import MainMenu from './MainMenu';
import { A, Link } from '../common/Link';

const publicUrl = process.env.PUBLIC_URL;

const HeaderContainer = styled.header`
	position: relative;
	padding: .1rem;
	height: 4rem;
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const LogoLink = styled(Link)`
	padding: .5rem;
	height: 100%;

	img {
		height: 100%;
	}
`;

const ExternalLink = A.extend`
	font-size: 1.5rem;
	padding: .5rem;
`;

const Header = () =>
	<HeaderContainer>
		<LogoLink to={publicUrl}>
			<img src={`${publicUrl}/assets/logo.png`} alt="Citation" />
		</LogoLink>
		<MainMenu />
		<ExternalLink href={`${publicUrl}/preview`} target="_blank">
			Preview
		</ExternalLink>
		<ExternalLink href={publicUrl} target="_blank">
			Production
		</ExternalLink>
	</HeaderContainer>;

export default Header;
