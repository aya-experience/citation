import React from 'react';
import { array } from 'prop-types';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// eslint-disable-next-line no-unused-expressions
// injectGlobal`
// 	@import url('https://fonts.googleapis.com/css?family=Lato');
//
// 	body {
// 		margin: 0;
// 		padding: 0;
// 		font-family: 'Lato', sans-serif;
// 	}
// `;

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
	// Const home = pages.filter(page => page.__id__ === 'home')[0];
	// const docs = home.children.filter(page => page.__id__ === 'docs')[0];
	// const others = home.children.filter(page => page.__id__ !== 'docs');

	console.log('links', links);

	return (
		<TopMenuContainer>
			<LogoLink to="/">
				<img src="/admin/assets/logo.png" alt="Citation" />
			</LogoLink>
			{/*
			<ul>
				{docs.children.map(doc => (
					<Link key={doc.id} to={`/docs/${doc.slug}`}>
						<li>{doc.title}</li>
					</Link>
				))}
			</ul>
			<ul>
				{others.map(other => (
					<Link key={other.id} to={`/${other.slug}`}>
						<li>{other.title}</li>
					</Link>
				))}
			</ul>
			*/}
			<MediaLinks>
				{links.map(links => (
					<MediaLink
						key={links.__id__}
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
