import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router';

import './Menu.css';

export default class Menu extends Component {
	static propTypes = {
		collections: PropTypes.object.isRequired
	}

	render() {
		return (
			<ul className="Menu-container">
				{_.map(this.props.collections, (value, key) => (
					<li key={key}>
						<p className="Menu-collection">{key}</p>
						<ul className="Menu-object-container">
							{value.collection.map(slug => (
								<li key={slug}>
									<Link to={`/object/${slug}`}>
										<p className="Menu-object">
											{slug}
										</p>
									</Link>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		);
	}
}
