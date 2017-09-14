import React from 'react';
import { array } from 'prop-types';
import styled from 'styled-components';

const HomePlusContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

const HomePlusBlock = styled.div`
	padding: 2rem;
	text-align: center;
	justify-content: space-around;
	display: flex;
	flex-direction: ${({ align }) => (align === 'left' ? 'row' : 'row-reverse')};
`;

const HomePlusContent = styled.div`width: 60%;`;

const HomePlus = ({ plus }) => {
	return (
		<HomePlusContainer>
			{plus.map(homePlus => (
				<HomePlusBlock key={homePlus.title} align={homePlus.align}>
					<p>IMAGE</p>
					<p>{homePlus.image}</p>
					<HomePlusContent>
						{homePlus.title}
						{homePlus.content}
					</HomePlusContent>
				</HomePlusBlock>
			))}
		</HomePlusContainer>
	);
};

HomePlus.propTypes = {
	plus: array.isRequired
};

export default HomePlus;
