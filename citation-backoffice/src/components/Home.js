import React from 'react';
import styled from 'styled-components';

import { Link } from './common/Link';

const publicUrl = process.env.PUBLIC_URL;

const HomeContainer = styled.main`
	width: 80rem;
	margin: auto;
	text-align: center;
`;

const Welcome = styled.p`
	font-size: 3rem;
	margin-top: 4rem;
`;

const TextBody = styled.p`
	font-size: 2rem;
	margin-top: 3rem;
	text-align: left;
`;

const BigLogo = styled.img`width: 50%;`;

const Home = () => (
	<HomeContainer>
		<Welcome>Welcome to Citation!</Welcome>
		<BigLogo src={`${publicUrl}/assets/logo-vertical.png`} />
		<TextBody>
			{"You're in the administration part. Use the top menu to configure your pages in "}
			<Link to="/structure">STRUCTURE</Link>
			{', configure your data model in '}
			<Link to="/model">MODEL</Link>
			{' and your data content in '}
			<Link to="/content">CONTENT</Link>
		</TextBody>
	</HomeContainer>
);

export default Home;
