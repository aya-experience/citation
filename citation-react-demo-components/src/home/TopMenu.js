import React, {PropTypes} from 'react';
import {Link} from 'react-router-dom';

import './TopMenu.css';

const TopMenu = ({pages, data}) => {
	const home = pages.filter(page => page.__id__ === 'home')[0];
	const docs = home.children.filter(page => page.__id__ === 'docs')[0];
	const others = home.children.filter(page => page.__id__ !== 'docs');

	return (
		<header className="TopMenu">
			<div className="logo">
				<Link to="/">
					Citation
				</Link>
			</div>
			<ul>
				{docs.children.map((doc, i) => (
					<Link key={i} to={`/docs/${doc.slug}`}>
						<li>{doc.title}</li>
					</Link>
				))}
			</ul>
			<div>
				<input type="search"/>
			</div>
			<ul>
				{others.map((other, i) => (
					<Link key={i} to={`/${other.slug}`}>
						<li>{other.title}</li>
					</Link>
				))}
			</ul>
			<ul>
				{data.map((data, i) => (
					<a key={i} href={data.content} target="_blank" rel="noopener noreferrer">
						<li>{data.title}</li>
					</a>
				))}
			</ul>
		</header>
	);
};

TopMenu.propTypes = {
	pages: PropTypes.array.isRequired,
	data: PropTypes.array.isRequired
};

export default TopMenu;
