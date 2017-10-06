import React from 'react';
import { array } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const TopMenuContainer = styled.header`
	position: relative;
	padding: 0.1rem;
	height: 4rem;
	width: 100%;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
`;

const LogoLink = styled(Link)`
	padding: 0.5rem;
	height: 100%;

	img {
		height: 100%;
	}
`;

const MediaLinks = styled.ul`
	list-style: none;
	display: flex;
	flex-direction: row;
	margin: 0;
	padding: 0;
`;

const MediaLink = styled.a`margin: 1rem;`;

const TopMenu = ({ links }) => {
	return (
		<TopMenuContainer>
			<LogoLink to="/">
				<img src="/admin/assets/logo.png" alt="Citation" />
			</LogoLink>
			<MediaLinks>
				{links.map(links => (
					<MediaLink
						key={links._id_}
						href={links.content}
						target="_blank"
						rel="noopener noreferrer"
					>
						<li>{links.title}</li>
					</MediaLink>
				))}
			</MediaLinks>
		</TopMenuContainer>
	);
};

TopMenu.propTypes = {
	links: array.isRequired
};

export default TopMenu;
