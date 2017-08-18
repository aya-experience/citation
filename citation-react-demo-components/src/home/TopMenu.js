import React from 'react';
import { array } from 'prop-types';
import { Link } from 'react-router-dom';

import './TopMenu.css';

const TopMenu = ({ pages, links }) => {
	const home = pages.filter(page => page.__id__ === 'home')[0];
	const docs = home.children.filter(page => page.__id__ === 'docs')[0];
	const others = home.children.filter(page => page.__id__ !== 'docs');

	return (
		<header className="TopMenu">
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
		</header>
	);
};

TopMenu.propTypes = {
	pages: array.isRequired,
	links: array.isRequired
};

export default TopMenu;
