import React from 'react';
import { array, object } from 'prop-types';
import styled from 'styled-components';

const BannerContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 20rem;
	font-size: 2rem;
	background-color: lightgray;
`;

const Banner = ({ image, children }) => {
	return (
		<BannerContainer>
			<p>{image.image}</p>
			<div className="Banner-CTA">{children}</div>
		</BannerContainer>
	);
};

Banner.propTypes = {
	children: array.isRequired,
	image: object.isRequired
};

export default Banner;
