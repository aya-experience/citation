import React from 'react';
import { array } from 'prop-types';
import { Link } from 'react-router-dom';
import styled, { injectGlobal } from 'styled-components';

// eslint-disable-next-line no-unused-expressions
injectGlobal`
	@import url('https://fonts.googleapis.com/css?family=Lato');

	body {
		margin: 0;
		padding: 0;
		font-family: 'Lato', sans-serif;
	}
`;

const TopMenuContainer = styled.header`
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	background-color: black;

	& ul {
		display: flex;
		align-items: center;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	& li {
		padding: .5rem;
	}

	& a {
		color: white;
	}
`;

const TopMenu = ({ pages, links }) => {
	const home = pages.filter(page => page.__id__ === 'home')[0];
	const docs = home.children.filter(page => page.__id__ === 'docs')[0];
	const others = home.children.filter(page => page.__id__ !== 'docs');

	return (
		<TopMenuContainer>
			<ul>
				{docs.children.map(doc =>
					<Link key={doc.id} to={`/docs/${doc.slug}`}>
						<li>
							{doc.title}
						</li>
					</Link>
				)}
			</ul>
			<ul>
				{others.map(other =>
					<Link key={other.id} to={`/${other.slug}`}>
						<li>
							{other.title}
						</li>
					</Link>
				)}
			</ul>
			<ul>
				{links.map(links =>
					<a key={links.id} href={links.content} target="_blank" rel="noopener noreferrer">
						<li>
							{links.title}
						</li>
					</a>
				)}
			</ul>
		</TopMenuContainer>
	);
};

TopMenu.propTypes = {
	pages: array.isRequired,
	links: array.isRequired
};

export default TopMenu;
