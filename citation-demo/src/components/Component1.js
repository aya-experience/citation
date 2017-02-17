import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

export default class Component1 extends Component {
	static propTypes = {
		children: PropTypes.array,
		data: PropTypes.array,
		pages: PropTypes.array,
		childPage: PropTypes.element
	};

	renderMenu(pages, context = '') {
		if (!Array.isArray(pages)) {
			return undefined;
		}
		return (
			<ul>
				{pages.map((page, key) => {
					const url = `${context}/${page.slug}`;
					return (
						<li key={key}>
							<Link to={url}>
								{page.title}
							</Link>
							{this.renderMenu(page.children, url)}
						</li>
					);
				})}
			</ul>
		);
	}

	render() {
		return (
			<div className="Component1">
				<header>{this.renderMenu(this.props.pages)}</header>
				<h1 className="Component1-title">
					Component1 Title: {this.props.data[0].title}
				</h1>
				<p className="Component1-content">
					Component1 Content: {this.props.data[0].content}
				</p>
				<div className="Component1-children">
					Chomponent1 Children: {this.props.children}
				</div>
				<div className="Component1-childPage">
					Chomponent1 Child Page: {this.props.childPage}
				</div>
			</div>
		);
	}
}
