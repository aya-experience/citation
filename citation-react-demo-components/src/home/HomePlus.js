import React, { PropTypes } from 'react';

import './HomePlus.css';

const HomePlus = ({ data }) => {
	return (
		<div className="HomePlus">
			{data.map(homePlus =>
				<div key={homePlus.title} className="HomePlusBlock">
					<div className={homePlus.align}>
						<p>
							IMAGE
						</p>
						<p>
							{homePlus.image}
						</p>
						<div className="PlusContent">
							{homePlus.title}
							{homePlus.content}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

HomePlus.propTypes = {
	data: PropTypes.array.isRequired
};

export default HomePlus;
