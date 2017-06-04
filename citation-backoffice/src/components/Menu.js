import _ from 'lodash';
import React, {Component, PropTypes} from 'react';
import {Link} from 'react-router-dom';

import './Menu.css';

export default class Menu extends Component {
	static propTypes = {
		collections: PropTypes.object.isRequired
	}

	render() {
		const pairs = _(this.props.collections).toPairs().sortBy(pair => pair[0]).value();
		return (
			<ul className="Menu-container">
				<Link to={'/schema'}>
					<p className="Menu-object">
						Edit schema
					</p>
				</Link>
				{pairs.map(([type, objects]) => (
					<li key={type}>
						<p className="Menu-collection">
							{type}
							<Link to={`/object/${type}`}>
								<button type="button" className="Button-object">
									+
								</button>
							</Link>
						</p>
						<ul className="Menu-object-container">
							{objects.map(object => (
								<li key={object.__id__}>
									<Link to={`/object/${type}/${object.__id__}`}>
										<p className="Menu-object">
											{object.__id__}
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
