import React, {PropTypes} from 'react';

import './Banner.css';

const icons = ['js', 'content', 'deploy'];

const Banner = ({data}) => (
	<div className="Banner">
		{data.map((data, i) => (
			<div key={i} className="Banner-column">
				<img src={`/assets/${icons[i]}.svg`} alt={data.title}/>
				<br/>
				{data.content}
			</div>
		))}
	</div>
);

Banner.propTypes = {
	data: PropTypes.array.isRequired
};

export default Banner;
